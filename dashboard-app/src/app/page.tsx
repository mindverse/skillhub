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

export default async function Home() {
  const { totalSkills, featured, trending, categories } = await getHomeData();
  const totalDisplay = totalSkills >= 1000 ? `${Math.floor(totalSkills / 1000)},${String(totalSkills % 1000).padStart(3, "0")}` : String(totalSkills);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
      <Nav />

      {/* ===== Hero: 搜索引擎 ===== */}
      <section style={{ padding: "80px 24px 64px", textAlign: "center", background: "#fff" }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.15, letterSpacing: -.5, color: "#1d1d1f" }}>
          搜索 {totalDisplay}+ AI 技能
        </h1>
        <p style={{ fontSize: 20, color: "#86868b", margin: "0 0 32px", fontWeight: 400 }}>
          全网最大中文 AI Skill 搜索引擎 — 搜索、评分、一键安装
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: 600, margin: "0 auto 24px" }}>
          <Link href="/skills" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#f5f5f7", borderRadius: 16, padding: "18px 24px",
              border: "1px solid #e5e5ea", cursor: "pointer",
              transition: "border-color .15s, box-shadow .15s",
            }}>
              <span style={{ fontSize: 20, color: "#86868b" }}>&#128269;</span>
              <span style={{ fontSize: 17, color: "#86868b" }}>搜索技能... 比如「小红书」「代码审查」「PPT」</span>
            </div>
          </Link>
        </div>

        {/* Quick category pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/skills?category=${cat.name_zh}`} style={{ textDecoration: "none" }}>
              <span style={{
                padding: "7px 16px", borderRadius: 980, fontSize: 14,
                background: "#e8e8ed", color: "#424245", cursor: "pointer",
                transition: "all .15s",
              }}>
                {cat.name_zh} {cat.skill_count}
              </span>
            </Link>
          ))}
        </div>

        {/* Quick install */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "#1d1d1f", borderRadius: 12, padding: "14px 24px",
        }}>
          <span style={{ color: "#86868b", fontSize: 14 }}>$</span>
          <code style={{ fontSize: 14, color: "#fff", fontFamily: "'SF Mono', Menlo, monospace" }}>npx skills add mindverse/skillhub --full-depth --skill &apos;*&apos; -g -y</code>
        </div>
        <p style={{ fontSize: 13, color: "#86868b", marginTop: 10 }}>或者一条命令安装全部 50 个官方精选技能</p>
      </section>

      {/* ===== Stats bar ===== */}
      <section style={{ padding: "20px 24px", background: "#fff", borderTop: "1px solid #f0f0f2" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          <StatItem value={totalDisplay + "+"} label="收录技能" />
          <StatItem value="50" label="官方精选" />
          <StatItem value="13" label="分类" />
          <StatItem value="12 重" label="安全检测" />
          <StatItem value="42" label="平台支持" />
        </div>
      </section>

      {/* ===== 效果演示 ===== */}
      <section style={{ padding: "48px 24px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, textAlign: "center", letterSpacing: -.2 }}>
          装完后，对 AI 说一句话就行
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DemoCard slug="xiaohongshu" input="帮我写个小红书种草笔记" output="emoji、短段落、爆款标题、标签策略全有，改改就能发" />
          <DemoCard slug="ppt-master" input="做个 PPT，主题是 Q1 复盘" output="生成 HTML 幻灯片，浏览器打开直接演示，15 套配色" />
          <DemoCard slug="code-review" input="帮我 review 一下这段代码" output="逐文件审查，输出结构化报告：严重 / 警告 / 建议三级" />
        </div>
      </section>

      {/* ===== 官方精选 ===== */}
      <section style={{ padding: "24px 24px 48px", maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -.2 }}>官方精选</h2>
          <Link href="/skills?ours=true" style={{ fontSize: 14, color: "#007aff", textDecoration: "none", fontWeight: 500 }}>全部 50 个精选 →</Link>
        </div>
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
                    {s.is_ours && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 6, background: "#fff0f5", color: "#ff2d55", fontWeight: 500 }}>精选</span>}
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
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -.2 }}>热门技能</h2>
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

      {/* ===== 差异化 ===== */}
      <section style={{ padding: "48px 24px 56px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>为什么选技能宝？</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <TrustCard title="中文优先" desc="唯一中文 AI Skill 搜索引擎。全部技能中文名、中文描述、中文搜索。" />
          <TrustCard title="安全评级" desc="每个技能 12 重安全检测，S/A/B/C/D 五级评分，安装前看到风险。" />
          <TrustCard title="全网收录" desc={`收录 ${totalDisplay}+ 技能，不只是我们自己的，全 GitHub 的 Skill 都能搜到。`} />
          <TrustCard title="官方精选" desc="50 个自研精选技能，中文优化、质量保证，一条命令全装。" />
        </div>
      </section>

      {/* ===== 底部 CTA ===== */}
      <section style={{ padding: "48px 24px", textAlign: "center", background: "#fff", borderTop: "1px solid #e5e5ea" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>找到你需要的 AI 技能</h2>
        <p style={{ fontSize: 16, color: "#86868b", marginBottom: 24 }}>{totalDisplay}+ 技能收录，中文搜索，安全评分，一键安装。</p>
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

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#1d1d1f" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#86868b" }}>{label}</div>
    </div>
  );
}

function DemoCard({ slug, input, output }: { slug: string; input: string; output: string }) {
  return (
    <Link href={`/skills/${slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        background: "#fff", borderRadius: 14, padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)",
        cursor: "pointer", transition: "box-shadow .15s",
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f", marginBottom: 6 }}>
          &ldquo;{input}&rdquo;
        </div>
        <div style={{ fontSize: 14, color: "#86868b", lineHeight: 1.5, marginBottom: 10 }}>
          → {output}
        </div>
        <div style={{ fontSize: 13, color: "#007aff", fontWeight: 500 }}>
          查看这个技能 →
        </div>
      </div>
    </Link>
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
