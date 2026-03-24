/**
 * jinengbao trending — 查看排行榜
 */

const API_BASE = "https://dashboard-app-omega-lyart.vercel.app";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";

const RANK_COLORS = [YELLOW, YELLOW, YELLOW]; // top 3

export async function trending(options) {
  const by = options.by || "stars";
  const limit = options.limit || 15;

  console.log(`\n${BOLD}排行榜${RESET} ${DIM}(按 ${by === "stars" ? "Stars" : by === "safety" ? "安全分" : "安装量"} 排序)${RESET}\n`);

  try {
    const res = await fetch(`${API_BASE}/api/skills/trending?by=${by}&limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.skills || data.skills.length === 0) {
      console.log("暂无数据");
      return;
    }

    for (let i = 0; i < data.skills.length; i++) {
      const s = data.skills[i];
      const name = s.name_zh || s.name;
      const rankColor = RANK_COLORS[i] || DIM;
      const ours = s.is_ours ? `${GREEN} [精选]${RESET}` : "";
      const metric = by === "stars"
        ? `${s.github_stars?.toLocaleString()} stars`
        : by === "safety"
          ? `${CYAN}${s.safety_score}分 ${s.safety_level}级${RESET}`
          : `${s.install_count?.toLocaleString()} 安装`;

      console.log(`  ${rankColor}#${String(i + 1).padStart(2)}${RESET}  ${BOLD}${name}${RESET}${ours}  ${metric}`);
      console.log(`      ${DIM}${s.category_zh || ""} · ${s.author_name || ""}${RESET}`);
    }

    console.log(`\n${DIM}更多: https://dashboard-app-omega-lyart.vercel.app/leaderboard${RESET}`);
  } catch (e) {
    console.error("获取排行榜失败:", e.message);
    process.exit(1);
  }
}
