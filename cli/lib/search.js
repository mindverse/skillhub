/**
 * jinengbao search — 搜索 AI 技能
 */

const API_BASE = "https://dashboard-app-omega-lyart.vercel.app";

const GRADE_COLORS = {
  S: "\x1b[36m",  // cyan
  A: "\x1b[32m",  // green
  B: "\x1b[33m",  // yellow
  C: "\x1b[90m",  // gray
  D: "\x1b[31m",  // red
};
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

export async function search(query, options) {
  if (!query) {
    console.log("用法: skillhub search <关键词>");
    console.log("例如: skillhub search 小红书");
    process.exit(1);
  }

  const params = new URLSearchParams({ q: query, pageSize: String(options.limit || 10) });
  if (options.category) params.set("category", options.category);
  if (options.safety) params.set("safety", options.safety);
  if (options.sort) params.set("sort", options.sort);
  if (options.ours) params.set("ours", "true");

  console.log(`\n${DIM}搜索「${query}」...${RESET}\n`);

  try {
    const res = await fetch(`${API_BASE}/api/skills?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.skills || data.skills.length === 0) {
      console.log("没有找到匹配的技能。试试其他关键词？");
      return;
    }

    console.log(`${DIM}找到 ${data.total} 个技能（显示前 ${data.skills.length} 个）${RESET}\n`);

    for (const s of data.skills) {
      const name = s.name_zh || s.name;
      const grade = s.safety_level || "C";
      const color = GRADE_COLORS[grade] || DIM;
      const ours = s.is_ours ? " [精选]" : "";
      const stars = s.github_stars ? ` · ${s.github_stars} stars` : "";
      const desc = (s.description_zh || s.description || "").slice(0, 60);

      console.log(`  ${BOLD}${name}${RESET}${ours}  ${color}${grade}级 ${s.safety_score}${RESET}${stars}`);
      console.log(`  ${DIM}${desc}${RESET}`);
      console.log(`  ${DIM}安装: ${s.install_command || `npx skills add ${s.repo_full_name} -g -y`}${RESET}`);
      console.log();
    }

    if (data.totalPages > 1) {
      console.log(`${DIM}共 ${data.totalPages} 页，使用 --page N 查看更多${RESET}`);
    }
  } catch (e) {
    console.error("搜索失败:", e.message);
    console.log("请检查网络连接后重试");
    process.exit(1);
  }
}
