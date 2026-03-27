import Link from "next/link";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

const gradeColor: Record<string, string> = { S: "#30b0c7", A: "#34c759", B: "#ff9500", C: "#86868b" };

async function getHomeData() {
  const [
    { count: totalSkills },
    { data: featured },
    { data: trending },
    { data: categories },
  ] = await Promise.all([
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*").eq("is_featured", true).eq("is_ours", true).order("safety_score", { ascending: false }).limit(6),
    supabase.from("skills").select("slug,name,name_zh,description_zh,safety_level,github_stars,is_ours").order("github_stars", { ascending: false }).limit(5),
    supabase.from("categories").select("slug,name_zh,skill_count").order("skill_count", { ascending: false }).limit(8),
  ]);
  return {
    totalSkills: totalSkills || 0,
    featured: featured || [],
    trending: trending || [],
    categories: categories || [],
  };
}

// 场景驱动的推荐卡片
const SCENARIOS = [
  {
    scenario: "写小红书种草笔记",
    skill: "xiaohongshu",
    skillName: "小红书",
    result: "emoji、短段落、爆款标题、标签策略全有，改改就能发",
    cmd: "npx skills add mindverse/skillhub@xiaohongshu -g -y",
  },
  {
    scenario: "做个季度汇报 PPT",
    skill: "ppt-master",
    skillName: "PPT大师",
    result: "生成 HTML 幻灯片，浏览器打开直接演示，15 套配色可选",
    cmd: "npx skills add mindverse/skillhub@ppt-master -g -y",
  },
  {
    scenario: "帮我 review 一下代码",
    skill: "code-review",
    skillName: "代码审查",
    result: "逐文件结构化报告：严重 / 警告 / 建议三级，附修复方案",
    cmd: "npx skills add mindverse/skillhub@code-review -g -y",
  },
  {
    scenario: "这个合同有没有坑",
    skill: "contract-review",
    skillName: "合同审查",
    result: "逐条标注风险等级，霸王条款高亮，基于中国法律场景",
    cmd: "npx skills add mindverse/skillhub@contract-review -g -y",
  },
  {
    scenario: "写个抖音带货脚本",
    skill: "douyin-script",
    skillName: "抖音脚本",
    result: "前 3 秒钩子 + 正文 + 分镜表，口播/带货/剧情多种类型",
    cmd: "npx skills add mindverse/skillhub@douyin-script -g -y",
  },
];

export default async function Home() {
  const { totalSkills, featured, trending, categories } = await getHomeData();
  const totalDisplay = totalSkills >= 1000 ? `${Math.floor(totalSkills / 1000)},${String(totalSkills % 1000).padStart(3, "0")}` : String(totalSkills);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
      <Nav />

      {/* ===== Hero: 场景驱动 ===== */}
      <section style={{ padding: "80px 24px 48px", textAlign: "center", background: "#fff" }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.15, letterSpacing: -.5, color: "#1d1d1f" }}>
          你想做什么？帮你找到对的技能
        </h1>
        <p style={{ fontSize: 20, color: "#86868b", margin: "0 0 36px", fontWeight: 400 }}>
          {totalDisplay}+ AI 技能，中文搜索，安全评分，找到就能装
        </p>

        {/* Search bar — 核心入口 */}
        <div style={{ maxWidth: 600, margin: "0 auto 28px" }}>
          <Link href="/skills" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#fff", borderRadius: 16, padding: "18px 24px",
              border: "2px solid #e5e5ea", cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,.06)",
              transition: "border-color .15s, box-shadow .15s",
            }}>
              <span style={{ fontSize: 20, color: "#86868b" }}>&#128269;</span>
              <span style={{ fontSize: 17, color: "#86868b" }}>搜索技能... 「写小红书」「审合同」「做 PPT」</span>
            </div>
          </Link>
        </div>

        {/* Quick category pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/skills?category=${cat.name_zh}`} style={{ textDecoration: "none" }}>
              <span style={{
                padding: "7px 16px", borderRadius: 980, fontSize: 14,
                background: "#f5f5f7", color: "#424245", cursor: "pointer",
                transition: "all .15s",
              }}>
                {cat.name_zh} {cat.skill_count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 场景演示：说句话 → 找到技能 → 装上就用 ===== */}
      <section style={{ padding: "48px 24px", maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center", letterSpacing: -.2 }}>
          说句话，找到技能，装上就用
        </h2>
        <p style={{ fontSize: 15, color: "#86868b", textAlign: "center", marginBottom: 28 }}>
          每个技能独立安装，一条命令搞定，用完即走
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SCENARIOS.map((s) => (
            <Link key={s.skill} href={`/skills/${s.skill}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                background: "#fff", borderRadius: 16, padding: "22px 24px",
                boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)",
                cursor: "pointer", transition: "box-shadow .15s",
              }}>
                {/* 用户说的话 */}
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f", marginBottom: 8 }}>
                  &ldquo;{s.scenario}&rdquo;
                </div>
                {/* 匹配到的技能 + 结果 */}
                <div style={{ fontSize: 14, color: "#86868b", lineHeight: 1.6, marginBottom: 12 }}>
                  <span style={{ color: "#007aff", fontWeight: 600 }}>{s.skillName}</span> → {s.result}
                </div>
                {/* 安装命令 */}
                <div style={{
                  background: "#1d1d1f", borderRadius: 8, padding: "10px 16px",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ color: "#86868b", fontSize: 12 }}>$</span>
                  <code style={{ fontSize: 12, color: "#fff", fontFamily: "'SF Mono', Menlo, monospace" }}>{s.cmd}</code>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 官方精选 ===== */}
      <section style={{ padding: "24px 24px 48px", maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -.2 }}>精品技能</h2>
          <Link href="/skills?ours=true" style={{ fontSize: 14, color: "#007aff", textDecoration: "none", fontWeight: 500 }}>查看全部 →</Link>
        </div>
        <p style={{ fontSize: 15, color: "#86868b", marginTop: -8, marginBottom: 20 }}>
          我们从 {totalDisplay}+ 技能中精选了 50 个，针对中文场景深度优化，质量有保障
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
          {featured.map((s) => (
            <Link key={s.slug} href={`/skills/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                background: "#fff", borderRadius: 16, padding: "20px 20px 16px",
                boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)",
                cursor: "pointer", height: "100%",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{s.name_zh || s.name}</h3>
                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 6, background: "#fff0f5", color: "#ff2d55", fontWeight: 500 }}>精选</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: gradeColor[s.safety_level] || "#86868b" }}>{s.safety_level}级</span>
                </div>
                <p style={{ fontSize: 13, color: "#86868b", margin: "0 0 10px", lineHeight: 1.5 }}>
                  {(s.description_zh || s.description || "").slice(0, 60)}{(s.description_zh || s.description || "").length > 60 ? "..." : ""}
                </p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {(s.features || []).slice(0, 3).map((f: string, i: number) => (
                    <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "#f5f5f7", color: "#424245" }}>{f}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 热门排行 ===== */}
      <section style={{ padding: "24px 24px 48px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -.2 }}>大家在用</h2>
          <Link href="/leaderboard" style={{ fontSize: 14, color: "#007aff", textDecoration: "none", fontWeight: 500 }}>排行榜 →</Link>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)" }}>
          {trending.map((s, i) => (
            <Link key={s.slug} href={`/skills/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                borderBottom: i < trending.length - 1 ? "1px solid #f0f0f2" : "none",
                cursor: "pointer",
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: i < 3 ? "#ff9500" : "#86868b", width: 24 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{s.name_zh || s.name}</span>
                    {s.is_ours && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 6, background: "#fff0f5", color: "#ff2d55", fontWeight: 500 }}>精选</span>}
                  </div>
                  <span style={{ fontSize: 13, color: "#86868b" }}>{(s.description_zh || "").slice(0, 40)}</span>
                </div>
                <span style={{ fontSize: 13, color: "#86868b" }}>{s.github_stars?.toLocaleString()} stars</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 为什么选技能宝 ===== */}
      <section style={{ padding: "48px 24px 56px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>为什么用技能宝找技能？</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <TrustCard title="中文市场唯一" desc="全网唯一中文 AI Skill 搜索引擎。中文名、中文描述、中文搜索，给中国用户做的。" />
          <TrustCard title="贴合真实场景" desc="不是罗列功能清单，而是从你的需求出发——写小红书、审合同、做 PPT——帮你找到最合适的那一个。" />
          <TrustCard title="安全看得见" desc="每个技能 12 重安全检测，S/A/B/C/D 五级评分。装之前就知道安不安全。" />
          <TrustCard title="用多少装多少" desc="不搞全家桶。需要哪个装哪个，一条命令搞定，支持 42 个 AI 平台。" />
        </div>
      </section>

      {/* ===== 底部 CTA ===== */}
      <section style={{ padding: "48px 24px", textAlign: "center", background: "#fff", borderTop: "1px solid #e5e5ea" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>找到适合你的 AI 技能</h2>
        <p style={{ fontSize: 16, color: "#86868b", marginBottom: 24 }}>{totalDisplay}+ 技能收录，搜一下就知道有没有</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/skills" style={{
            display: "inline-flex", alignItems: "center", padding: "14px 28px",
            background: "#007aff", color: "#fff", borderRadius: 12, fontSize: 16,
            fontWeight: 600, textDecoration: "none",
          }}>
            搜索技能
          </Link>
          <Link href="/submit" style={{
            display: "inline-flex", alignItems: "center", padding: "14px 28px",
            background: "#f5f5f7", color: "#1d1d1f", borderRadius: 12, fontSize: 16,
            fontWeight: 600, textDecoration: "none", border: "1px solid #e5e5ea",
          }}>
            提交你的 Skill
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e5ea", padding: "24px", textAlign: "center", fontSize: 13, color: "#86868b", background: "#fff" }}>
        <p style={{ margin: 0 }}>
          技能宝 SkillHub — <a href="https://github.com/mindverse/skillhub" style={{ color: "#007aff", textDecoration: "none" }}>GitHub</a>
          {" · "}
          <Link href="/leaderboard" style={{ color: "#007aff", textDecoration: "none" }}>排行榜</Link>
          {" · "}
          <Link href="/submit" style={{ color: "#007aff", textDecoration: "none" }}>提交收录</Link>
        </p>
      </footer>
    </div>
  );
}

function TrustCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "18px 18px", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)" }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{title}</h3>
      <p style={{ fontSize: 13, color: "#86868b", lineHeight: 1.5, margin: 0 }}>{desc}</p>
    </div>
  );
}
