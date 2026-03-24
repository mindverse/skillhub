import { NextResponse } from "next/server";

export const revalidate = 300; // 5 min cache

export async function GET() {
  try {
    const [repoRes, skillsRes] = await Promise.all([
      fetch("https://api.github.com/repos/mindverse/skillhub", {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 300 },
      }),
      fetch("https://api.github.com/repos/mindverse/skillhub/contents/skills", {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 300 },
      }),
    ]);

    const repo = repoRes.ok ? await repoRes.json() : null;
    const skillsDirs = skillsRes.ok ? await skillsRes.json() : [];

    return NextResponse.json({
      stars: repo?.stargazers_count ?? 0,
      forks: repo?.forks_count ?? 0,
      updated_at: repo?.pushed_at ?? null,
      skill_count: Array.isArray(skillsDirs) ? skillsDirs.filter((d: { type: string }) => d.type === "dir").length : 0,
      open_issues: repo?.open_issues_count ?? 0,
    });
  } catch {
    return NextResponse.json({ stars: 0, forks: 0, updated_at: null, skill_count: 20, open_issues: 0 });
  }
}
