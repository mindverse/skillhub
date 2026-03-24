import Nav from "@/components/Nav";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, type SkillRow } from "@/lib/supabase";

export const revalidate = 300;
export const dynamicParams = true;

const gradeColor: Record<string, string> = { S: "#30b0c7", A: "#34c759", B: "#ff9500", C: "#86868b", D: "#ff3b30" };

export async function generateStaticParams() {
  // Only pre-generate our own skills
  const { data } = await supabase.from("skills").select("slug").eq("is_ours", true);
  return (data || []).map((s) => ({ slug: s.slug }));
}

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: skill, error } = await supabase
    .from("skills")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !skill) notFound();

  // Fetch related
  const { data: related } = await supabase
    .from("skills")
    .select("slug,name,name_zh,description_zh,description,category_zh,safety_score,safety_level,github_stars,is_ours")
    .eq("category", skill.category)
    .neq("slug", slug)
    .order("is_ours", { ascending: false })
    .order("github_stars", { ascending: false })
    .limit(4);

  const displayName = skill.name_zh || skill.name;
  const displayDesc = skill.description_zh || skill.description || "";
  const installCmd = skill.install_command || `npx skills add ${skill.repo_full_name || skill.slug} -g -y`;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
      <Nav />

      <div style={{ padding: "32px 24px 64px", maxWidth: 960, margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 14, color: "#86868b", marginBottom: 24 }}>
          <Link href="/skills" style={{ color: "#0071e3", textDecoration: "none" }}>搜索技能</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#424245" }}>{displayName}</span>
        </div>

        {/* Hero area */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px 28px", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 34, fontWeight: 700, margin: 0, letterSpacing: -.3 }}>{displayName}</h1>
            {skill.is_ours && <span style={{ fontSize: 12, padding: "3px 12px", borderRadius: 980, background: "#fff0f5", color: "#ff2d55", fontWeight: 600 }}>官方精选</span>}
            {!skill.is_ours && skill.author_verified && <span style={{ fontSize: 12, padding: "3px 12px", borderRadius: 980, background: "#e8f5e8", color: "#34c759", fontWeight: 600 }}>已认证</span>}
            <span style={{ fontSize: 12, padding: "3px 12px", borderRadius: 980, background: "#f5f5f7", color: "#86868b" }}>{skill.category_zh || skill.category}</span>
          </div>
          <p style={{ fontSize: 18, color: "#424245", lineHeight: 1.6, margin: "0 0 24px", maxWidth: 640 }}>{displayDesc}</p>

          {/* Install */}
          <div style={{ background: "#1d1d1f", borderRadius: 12, padding: "15px 22px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#86868b", fontSize: 14 }}>$</span>
            <code style={{ fontSize: 14, color: "#fff", fontFamily: "'SF Mono', Menlo, monospace", flex: 1 }}>{installCmd}</code>
          </div>
          <p style={{ fontSize: 13, color: "#86868b", marginTop: 10 }}>在终端运行即可安装。支持 Claude Code、Cursor、Windsurf 等 42 个 AI 平台。</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Features */}
            {skill.features && skill.features.length > 0 && (
              <Card title="这个技能能做什么">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {skill.features.map((f: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>
                      <span style={{ color: "#34c759", fontSize: 17 }}>&#10003;</span> {f}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* How to use */}
            {skill.use_cases && skill.use_cases.length > 0 && (
              <Card title="怎么用">
                <p style={{ fontSize: 14, color: "#86868b", marginBottom: 12 }}>安装后，直接对你的 AI 助手说：</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {skill.use_cases.map((u: string, i: number) => (
                    <div key={i} style={{ background: "#f5f5f7", borderRadius: 10, padding: "11px 16px", fontSize: 15, color: "#1d1d1f" }}>
                      &ldquo;{u}&rdquo;
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Preview */}
            {skill.skill_md_preview && (
              <Card title="技能内容预览">
                <div style={{ background: "#f5f5f7", borderRadius: 12, padding: "20px 22px" }}>
                  <pre style={{ fontSize: 14, color: "#424245", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontFamily: "inherit" }}>
                    {skill.skill_md_preview}
                  </pre>
                </div>
                {skill.source_url && (
                  <a
                    href={skill.source_url}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 12, fontSize: 14, color: "#0071e3", textDecoration: "none", fontWeight: 500 }}
                  >
                    在 GitHub 查看完整内容 →
                  </a>
                )}
              </Card>
            )}

            {/* If no features/use_cases, show description and source */}
            {(!skill.features || skill.features.length === 0) && (
              <Card title="技能说明">
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#424245" }}>
                  {skill.description || displayDesc}
                </p>
                {skill.tags && skill.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
                    {skill.tags.slice(0, 10).map((t: string, i: number) => (
                      <span key={i} style={{ fontSize: 13, padding: "4px 12px", borderRadius: 980, background: "#f5f5f7", color: "#424245" }}>{t}</span>
                    ))}
                  </div>
                )}
                {skill.source_url && (
                  <a
                    href={skill.source_url}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 16, fontSize: 14, color: "#0071e3", textDecoration: "none", fontWeight: 500 }}
                  >
                    查看源码 →
                  </a>
                )}
              </Card>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Safety */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)" }}>
              <div style={{ fontSize: 12, color: "#86868b", fontWeight: 600, textTransform: "uppercase", letterSpacing: .8, marginBottom: 14 }}>安全评分</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                <span style={{ fontSize: 48, fontWeight: 700, color: gradeColor[skill.safety_level] || "#86868b", letterSpacing: -1 }}>{skill.safety_score}</span>
                <span style={{ fontSize: 16, color: "#86868b" }}>/100</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 600, padding: "3px 12px", borderRadius: 980, background: `${gradeColor[skill.safety_level] || "#86868b"}18`, color: gradeColor[skill.safety_level] || "#86868b" }}>{skill.safety_level}级</span>
                <span style={{ fontSize: 12, color: "#34c759" }}>{skill.safety_checks_passed}/{skill.safety_checks_total} 项检测通过</span>
              </div>
              <div style={{ height: 6, background: "#f0f0f2", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${skill.safety_score}%`, borderRadius: 3, background: gradeColor[skill.safety_level] || "#86868b", transition: "width .6s" }} />
              </div>
            </div>

            {/* Info */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)" }}>
              <div style={{ fontSize: 12, color: "#86868b", fontWeight: 600, textTransform: "uppercase", letterSpacing: .8, marginBottom: 14 }}>技能信息</div>
              {skill.lines > 0 && <InfoRow label="代码量" value={`${skill.lines} 行`} />}
              <InfoRow label="来源" value={skill.is_ours ? "官方精选" : (skill.source_platform || "GitHub")} />
              {skill.author_name && <InfoRow label="作者" value={skill.author_name} />}
              {skill.repo_full_name && <InfoRow label="仓库" value={skill.repo_full_name} />}
              {skill.github_stars > 0 && <InfoRow label="Stars" value={skill.github_stars.toLocaleString()} />}
              <InfoRow label="分类" value={skill.category_zh || skill.category} />
              {skill.upstream && <InfoRow label="上游" value={skill.upstream} />}
            </div>

            {/* Triggers */}
            {skill.trigger_words && skill.trigger_words.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize: 12, color: "#86868b", fontWeight: 600, textTransform: "uppercase", letterSpacing: .8, marginBottom: 14 }}>触发关键词</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {skill.trigger_words.map((t: string, i: number) => (
                    <span key={i} style={{ fontSize: 13, padding: "4px 12px", borderRadius: 980, background: "#f5f5f7", color: "#424245" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related && related.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: -.2 }}>同类技能</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {related.map((s) => (
                <Link key={s.slug} href={`/skills/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    background: "#fff", borderRadius: 14, padding: "18px 20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)",
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>{s.name_zh || s.name}</span>
                        {s.is_ours && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 6, background: "#fff0f5", color: "#ff2d55", fontWeight: 500 }}>精选</span>}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: gradeColor[s.safety_level] || "#86868b" }}>{s.safety_level}级</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#86868b", margin: 0, lineHeight: 1.5 }}>
                      {(s.description_zh || s.description || "").slice(0, 60)}{(s.description_zh || s.description || "").length > 60 ? "..." : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "24px 24px 20px", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)" }}>
      <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "8px 0", borderBottom: "1px solid #f0f0f2" }}>
      <span style={{ color: "#86868b" }}>{label}</span>
      <span style={{ color: "#1d1d1f" }}>{value}</span>
    </div>
  );
}
