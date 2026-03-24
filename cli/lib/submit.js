/**
 * jinengbao submit — 提交 Skill 收录
 */

const API_BASE = "https://dashboard-app-omega-lyart.vercel.app";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

export async function submit(repo) {
  if (!repo) {
    console.log("用法: skillhub submit <owner/repo>");
    console.log("例如: skillhub submit myuser/my-skill");
    console.log("\n要求:");
    console.log("  - 仓库中包含 SKILL.md 文件");
    console.log("  - SKILL.md 有 frontmatter (name, description)");
    console.log("  - 开源许可证 (MIT / Apache 推荐)");
    process.exit(1);
  }

  // Validate format
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    console.error(`${RED}格式错误${RESET}: 请使用 owner/repo 格式`);
    process.exit(1);
  }

  console.log(`\n${BOLD}提交收录${RESET}: ${repo}\n`);

  try {
    const res = await fetch(`${API_BASE}/api/skills/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_full_name: repo }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(`${GREEN}${BOLD}提交成功！${RESET}`);
      console.log(`${data.message}`);
      if (data.id) console.log(`${DIM}提交 ID: ${data.id}${RESET}`);
    } else {
      console.error(`${RED}提交失败${RESET}: ${data.error}`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`${RED}网络错误${RESET}: ${e.message}`);
    process.exit(1);
  }
}
