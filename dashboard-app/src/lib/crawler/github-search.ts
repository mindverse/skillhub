/**
 * GitHub Code Search — 发现全网 SKILL.md 文件
 * 使用 GitHub Code Search API 搜索 filename:SKILL.md
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const API_BASE = "https://api.github.com";

interface GitHubSearchResult {
  name: string;
  path: string;
  repository: {
    full_name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    pushed_at: string;
    license: { spdx_id: string } | null;
    owner: { login: string; type: string };
  };
  html_url: string;
  url: string; // API url to get content
}

interface DiscoveredSkill {
  repoFullName: string;
  repoUrl: string;
  skillPath: string;
  contentUrl: string;
  stars: number;
  forks: number;
  description: string | null;
  license: string | null;
  owner: string;
  pushedAt: string;
}

export async function searchGitHubForSkills(page = 1, perPage = 100): Promise<{
  skills: DiscoveredSkill[];
  totalCount: number;
}> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SkillHub-Crawler/1.0",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  // Search for files named SKILL.md
  const query = encodeURIComponent("filename:SKILL.md user-invocable");
  const url = `${API_BASE}/search/code?q=${query}&per_page=${perPage}&page=${page}&sort=indexed&order=desc`;

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${err}`);
  }

  const data = await res.json();

  const skills: DiscoveredSkill[] = (data.items || []).map((item: GitHubSearchResult) => ({
    repoFullName: item.repository.full_name,
    repoUrl: item.repository.html_url,
    skillPath: item.path,
    contentUrl: item.url,
    stars: item.repository.stargazers_count,
    forks: item.repository.forks_count,
    description: item.repository.description,
    license: item.repository.license?.spdx_id || null,
    owner: item.repository.owner.login,
    pushedAt: item.repository.pushed_at,
  }));

  return { skills, totalCount: data.total_count || 0 };
}

export async function fetchFileContent(apiUrl: string): Promise<string | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SkillHub-Crawler/1.0",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const res = await fetch(apiUrl, { headers });
  if (!res.ok) return null;

  const data = await res.json();
  if (data.encoding === "base64" && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return data.content || null;
}
