import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { searchGitHubForSkills, fetchFileContent } from "@/lib/crawler/github-search";
import { parseSkillMd } from "@/lib/crawler/skill-parser";
import { scanSafety } from "@/lib/crawler/safety-scanner";

// Lazy init to avoid build errors when env vars aren't set
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

// Simple Chinese category mapping
const CATEGORY_MAP: Record<string, { en: string; zh: string }> = {
  "code": { en: "development", zh: "开发工具" },
  "review": { en: "development", zh: "开发工具" },
  "test": { en: "development", zh: "开发工具" },
  "debug": { en: "development", zh: "开发工具" },
  "api": { en: "development", zh: "开发工具" },
  "design": { en: "design", zh: "设计" },
  "ui": { en: "design", zh: "设计" },
  "ux": { en: "design", zh: "设计" },
  "write": { en: "content", zh: "内容创作" },
  "content": { en: "content", zh: "内容创作" },
  "blog": { en: "content", zh: "内容创作" },
  "doc": { en: "content", zh: "内容创作" },
  "security": { en: "security", zh: "安全" },
  "audit": { en: "security", zh: "安全" },
  "data": { en: "data", zh: "数据" },
  "analytics": { en: "data", zh: "数据" },
  "deploy": { en: "devops", zh: "运维" },
  "ci": { en: "devops", zh: "运维" },
  "docker": { en: "devops", zh: "运维" },
  "market": { en: "marketing", zh: "营销" },
  "seo": { en: "marketing", zh: "营销" },
};

function guessCategory(name: string, description: string): { en: string; zh: string } {
  const text = `${name} ${description}`.toLowerCase();
  for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
    if (text.includes(keyword)) return cat;
  }
  return { en: "workflow", zh: "工作流" };
}

function slugify(name: string, repoFullName: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "");
  if (slug && slug.length > 2) return slug;
  return repoFullName.replace("/", "-").toLowerCase();
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

  // Verify cron secret or admin token
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const maxPages = Math.min(body.pages || 3, 10);

  let totalDiscovered = 0;
  let totalIndexed = 0;
  let totalErrors = 0;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const { skills } = await searchGitHubForSkills(page, 30);
      totalDiscovered += skills.length;

      for (const discovered of skills) {
        try {
          // Check if already indexed recently (within 24h)
          const { data: existing } = await supabase
            .from("skills")
            .select("id,indexed_at")
            .eq("repo_full_name", discovered.repoFullName)
            .limit(1);

          if (existing && existing.length > 0) {
            const lastIndexed = new Date(existing[0].indexed_at);
            const hoursSince = (Date.now() - lastIndexed.getTime()) / (1000 * 60 * 60);
            if (hoursSince < 24) continue;
          }

          // Fetch SKILL.md content
          const content = await fetchFileContent(discovered.contentUrl);
          if (!content) continue;

          // Parse
          const parsed = parseSkillMd(content);
          if (!parsed) continue;

          // Safety scan
          const safety = scanSafety(
            content,
            discovered.stars,
            !!discovered.license,
            false,
            !!parsed.name,
          );

          // Skip D-level skills
          if (safety.level === "D") continue;

          // Determine category
          const cat = guessCategory(parsed.name, parsed.description);
          const slug = slugify(parsed.name, discovered.repoFullName);
          const id = `gh_${discovered.repoFullName.replace("/", "_")}`;

          // Upsert
          const { error } = await supabase.from("skills").upsert({
            id,
            slug,
            name: parsed.name,
            description: parsed.description,
            category: cat.en,
            category_zh: cat.zh,
            tags: [parsed.name.toLowerCase(), ...parsed.description.toLowerCase().split(/\s+/).slice(0, 5)],
            source_platform: "github",
            source_url: discovered.repoUrl,
            repo_full_name: discovered.repoFullName,
            author_name: discovered.owner,
            author_github: discovered.owner,
            github_stars: discovered.stars,
            github_forks: discovered.forks,
            safety_score: safety.score,
            safety_level: safety.level,
            safety_checks_passed: safety.checksPassed,
            safety_checks_total: safety.checksTotal,
            safety_last_scan: new Date().toISOString(),
            install_command: `npx skills add ${discovered.repoFullName} -g -y`,
            install_method: "skills-cli",
            skill_md_preview: parsed.contentPreview,
            lines: parsed.lineCount,
            skill_type: "community",
            last_updated: discovered.pushedAt,
            indexed_at: new Date().toISOString(),
          }, { onConflict: "id" });

          if (!error) totalIndexed++;
          else totalErrors++;
        } catch {
          totalErrors++;
        }
      }

      // Rate limit: wait between pages
      if (page < maxPages) {
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (e) {
      console.error(`Error on page ${page}:`, e);
      break;
    }
  }

  // Update category counts
  try { await supabase.rpc("update_category_counts"); } catch { /* ignore */ }

  return NextResponse.json({
    discovered: totalDiscovered,
    indexed: totalIndexed,
    errors: totalErrors,
    pages: maxPages,
  });
}

// GET for health check / manual trigger info
export async function GET() {
  const supabase = getSupabase();
  const { count } = await supabase.from("skills").select("*", { count: "exact", head: true });
  return NextResponse.json({
    status: "ready",
    totalSkills: count || 0,
    endpoints: {
      trigger: "POST /api/crawler/trigger (with CRON_SECRET)",
      search: "GET /api/skills?q=keyword",
    },
  });
}
