/**
 * 一次性迁移脚本：将 recommendations.json + skills-data.ts 的数据写入 Supabase
 *
 * 运行方式:
 *   NEXT_PUBLIC_SUPABASE_URL=xxx NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx npx tsx src/lib/db/seed.ts
 *
 * 或者在 .env.local 设好环境变量后:
 *   npx tsx src/lib/db/seed.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local if exists
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // no .env.local, rely on environment
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

// Category mapping: Chinese → English slug
const categoryMap: Record<string, string> = {
  "开发工具": "development",
  "内容创作": "content",
  "设计": "design",
  "效率工具": "productivity",
  "安全": "security",
  "营销": "marketing",
  "数据": "data",
  "运维": "devops",
  "教育": "education",
  "集成": "integration",
  "多媒体": "multimedia",
  "商业": "business",
  "工作流": "workflow",
};

interface RecommendationSkill {
  id: string;
  name: string;
  name_zh: string;
  slug: string;
  description: string;
  description_zh: string;
  category: string;
  category_zh: string;
  subcategory: string;
  tags: string[];
  source: { platform: string; url: string; repo_full_name: string };
  author: { name: string; github: string; verified: boolean };
  stats: {
    github_stars: number;
    github_forks: number;
    downloads: number;
    installs: number;
    last_updated: string;
    created_at: string;
  };
  security: {
    score: number;
    level: string;
    last_scan: string;
    checks_passed: number;
    checks_total: number;
  };
  compatibility: {
    platforms: string[];
    min_version: string;
    languages: string[];
  };
  install: { method: string; command: string };
  is_curated: boolean;
  is_featured: boolean;
  curated_rank: number;
}

// Our skills data (hardcoded slugs that are ours)
const OUR_SKILL_SLUGS = new Set([
  "xiaohongshu", "frontend-design", "web-design", "brainstorming", "ppt-master",
  "code-review", "security-audit", "react-best-practices", "douyin-script",
  "wechat-mp", "tdd", "debugger", "project-planner", "seo-master", "copywriter",
  "data-analyst", "api-builder", "git-master", "zhihu-writer", "bilibili-script",
  "docker-deploy", "ci-cd", "slack-bot", "tutorial-writer", "video-editor",
  "email-marketing", "weibo-hot", "taobao-listing", "resume-zh", "meeting-notes",
  "weekly-report", "interviewer", "contract-review", "wechat-mini", "podcast-script",
  "gaokao-essay", "sql-helper", "regex-helper", "markdown-doc", "performance-tuner",
  "paper-reducer", "naming-master", "dingding-doc", "redbook-analytics",
  "chinese-copyfix", "aws-helper", "typescript-strict", "landing-page",
  "chrome-extension", "system-design",
]);

async function seed() {
  console.log("Reading recommendations.json...");
  const jsonPath = resolve(process.cwd(), "../registry/recommendations.json");
  const raw = readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw) as { skills: RecommendationSkill[] };
  console.log(`Found ${data.skills.length} skills in recommendations.json`);

  // Prepare batch — upsert in chunks of 500
  const CHUNK_SIZE = 500;
  const rows = data.skills.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    name_zh: s.name_zh || null,
    description: s.description || null,
    description_zh: s.description_zh || null,
    category: s.category,
    category_zh: s.category_zh || null,
    subcategory: s.subcategory || null,
    tags: s.tags || [],
    source_platform: s.source?.platform || "github",
    source_url: s.source?.url || null,
    repo_full_name: s.source?.repo_full_name || null,
    author_name: s.author?.name || null,
    author_github: s.author?.github || null,
    author_verified: s.author?.verified || false,
    github_stars: s.stats?.github_stars || 0,
    github_forks: s.stats?.github_forks || 0,
    downloads: s.stats?.downloads || 0,
    install_count: s.stats?.installs || 0,
    safety_score: s.security?.score || 0,
    safety_level: s.security?.level || "C",
    safety_checks_passed: s.security?.checks_passed || 0,
    safety_checks_total: s.security?.checks_total || 12,
    safety_last_scan: s.security?.last_scan || null,
    is_ours: OUR_SKILL_SLUGS.has(s.slug),
    is_featured: s.is_featured || false,
    is_curated: s.is_curated || false,
    curated_rank: s.curated_rank || 0,
    install_method: s.install?.method || "skills-cli",
    install_command: s.install?.command || null,
    platforms: s.compatibility?.platforms || ["claude-code"],
    min_version: s.compatibility?.min_version || "1.0.0",
    languages: s.compatibility?.languages || [],
    skill_type: OUR_SKILL_SLUGS.has(s.slug) ? "enhanced" : "community",
    last_updated: s.stats?.last_updated || new Date().toISOString(),
    created_at: s.stats?.created_at || new Date().toISOString(),
  }));

  console.log(`Upserting ${rows.length} skills in chunks of ${CHUNK_SIZE}...`);

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase.from("skills").upsert(chunk, { onConflict: "id" });
    if (error) {
      console.error(`Error at chunk ${i / CHUNK_SIZE + 1}:`, error.message);
    } else {
      console.log(`  Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(rows.length / CHUNK_SIZE)} done`);
    }
  }

  // Now enrich our 50 skills with extra data (features, useCases, etc.)
  console.log("\nEnriching our own skills with features/useCases...");
  // We'll dynamically import skills-data to get the enriched data
  const { allSkills } = await import("../skills-data.js");

  for (const s of allSkills) {
    const { error } = await supabase
      .from("skills")
      .update({
        features: s.features,
        use_cases: s.useCases,
        trigger_words: s.triggerWords,
        skill_md_preview: s.skillMdPreview,
        lines: s.lines,
        skill_type: s.type,
        upstream: s.upstream || null,
        is_ours: true,
        // Use our Chinese names/descriptions
        name_zh: s.name,
        description_zh: s.description,
        category_zh: s.category,
        category: categoryMap[s.category] || s.category,
        install_command: s.installCmd,
      })
      .eq("slug", s.slug);

    if (error) {
      // Skill not in recommendations.json — insert it
      console.log(`  Inserting our skill not in registry: ${s.slug}`);
      const { error: insertErr } = await supabase.from("skills").upsert({
        id: `ours_${s.slug}`,
        slug: s.slug,
        name: s.nameEn,
        name_zh: s.name,
        description: s.description,
        description_zh: s.description,
        category: categoryMap[s.category] || s.category,
        category_zh: s.category,
        tags: s.triggerWords,
        source_platform: "skillhub",
        source_url: `https://github.com/mindverse/skillhub/tree/main/skills/${s.slug}`,
        repo_full_name: "mindverse/skillhub",
        author_name: "技能宝",
        author_github: "kevinaimonster",
        author_verified: true,
        safety_score: s.safetyScore,
        safety_level: s.grade,
        safety_checks_passed: 12,
        safety_checks_total: 12,
        is_ours: true,
        is_featured: true,
        is_curated: true,
        install_method: "skills-cli",
        install_command: s.installCmd,
        features: s.features,
        use_cases: s.useCases,
        trigger_words: s.triggerWords,
        skill_md_preview: s.skillMdPreview,
        lines: s.lines,
        skill_type: s.type,
        upstream: s.upstream || null,
      }, { onConflict: "slug" });
      if (insertErr) console.error(`    Error inserting ${s.slug}:`, insertErr.message);
    }
  }

  // Update category counts
  console.log("\nUpdating category counts...");
  const { error: countErr } = await supabase.rpc("update_category_counts");
  if (countErr) console.error("Error updating counts:", countErr.message);

  console.log("\nDone! Seed complete.");
}

seed().catch(console.error);
