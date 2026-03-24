/**
 * jinengbao add — 安装 Skill（代理 npx skills add）
 */
import { execSync } from "child_process";

export async function add(repo) {
  if (!repo) {
    console.log("用法: skillhub add <owner/repo>");
    console.log("例如: skillhub add mindverse/skillhub@xiaohongshu");
    process.exit(1);
  }

  // If it's just a slug (no /), search first
  if (!repo.includes("/")) {
    console.log(`\n搜索「${repo}」...\n`);
    try {
      const res = await fetch(`https://dashboard-app-omega-lyart.vercel.app/api/skills?q=${encodeURIComponent(repo)}&pageSize=1`);
      const data = await res.json();
      if (data.skills && data.skills.length > 0) {
        const s = data.skills[0];
        const cmd = s.install_command || `npx skills add ${s.repo_full_name} -g -y`;
        console.log(`找到: ${s.name_zh || s.name} (${s.safety_level}级 ${s.safety_score}分)`);
        console.log(`运行: ${cmd}\n`);
        repo = s.repo_full_name || repo;
      }
    } catch {
      // ignore search error, proceed with direct install
    }
  }

  const cmd = repo.startsWith("npx") ? repo : `npx skills add ${repo} -g -y`;
  console.log(`安装中: ${cmd}\n`);

  try {
    execSync(cmd, { stdio: "inherit" });
    console.log("\n安装完成！");
  } catch {
    console.error("\n安装失败。请检查仓库名称是否正确。");
    process.exit(1);
  }
}
