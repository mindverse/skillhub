import { modules, phases, competitors } from "@/lib/data";
import { allSkills } from "@/lib/skills-data";
import Link from "next/link";

async function getGitHub() {
  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
    const res = await fetch(`${base}/api/github`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export default async function DashboardPage() {
  const gh = await getGitHub();
  const stars = gh?.stars ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
      {/* Header */}
      <header style={{
        padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,.72)", backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,.08)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>技能宝</span>
          <span style={{ fontSize: 13, padding: "2px 10px", borderRadius: 980, background: "#f5f5f7", color: "#86868b" }}>CEO 看板</span>
        </div>
        <Link href="/" style={{ fontSize: 13, color: "#007aff", textDecoration: "none" }}>← 前台</Link>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ===== 第一层：结论 ===== */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", letterSpacing: -.3 }}>
            产品已就绪，小红书 5 篇已发布，等待安装量破 0
          </h1>
          <p style={{ fontSize: 15, color: "#86868b", margin: 0, lineHeight: 1.6 }}>
            2 天完成原计划 4 周的技术工作。50 个 Skill、5005 条精选库、安全评分 v2 全部上线。
            运营体系（6 个 Agent + PM）已建立。首篇内容已发到小红书，另有 5 篇待发。
          </p>
        </div>

        {/* ===== 第二层：三个关键信息 ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
          {/* 1. 产品完成度 */}
          <KeyCard
            title="产品完成度"
            value="7/12"
            unit="KR 达标"
            color="#34c759"
            details={[
              "✅ 50 卫星 Skill（目标 50）",
              "✅ 5005 精选库（目标 5000）",
              "✅ 20 原创中国特色",
              "✅ 安全评分 S/A 95%+",
              "⬜ 安装量 0（目标 10000）",
              "⬜ 全量库 10万+",
            ]}
          />
          {/* 2. 增长现状 */}
          <KeyCard
            title="增长现状"
            value="5"
            unit="篇小红书"
            color="#007aff"
            details={[
              "✅ 小红书 5 篇已发布（J3 达标）",
              `⬜ GitHub Stars: ${stars}`,
              "⬜ 安装量: 0",
              "5 篇内容待发（掘金/V2EX/知乎/Twitter/视频）",
              "4 个 awesome PR 待合并",
            ]}
          />
          {/* 3. 需要你做的 */}
          <KeyCard
            title="需要你做的"
            value="2"
            unit="件事"
            color="#ff3b30"
            details={[
              "1. 发 content/juejin-01.md 到掘金",
              "2. 发 content/v2ex-01.md 到 V2EX",
              "（或说「发小红书」PM 帮你全链路发）",
              "其余内容（知乎/Twitter/视频）可后续发",
            ]}
          />
        </div>

        {/* ===== 第三层：支撑细节 ===== */}

        {/* OKR 概览 */}
        <Section title="OKR 达标情况">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <OkrRow label="O1 安装量" status="blocked" pct={0} detail="安装量 0 / 10000 — 阻塞于内容发布" />
            <OkrRow label="O2 内容库" status="done" pct={90} detail="50 Skill ✅ / 5005 精选 ✅ / 全量库待做" />
            <OkrRow label="O3 安全品牌" status="partial" pct={70} detail="v2 上线 / S/A 95% ✅ / 品牌认知待建" />
            <OkrRow label="O4 开发者生态" status="todo" pct={10} detail="CLI 就绪 / NPM 待发布 / 0 第三方" />
            <OkrRow label="O5 交叉导流" status="partial" pct={50} detail="植入率 100% ✅ / 转化率未知（无用户）" />
            <OkrRow label="O6 竞争" status="partial" pct={60} detail="中文 100% ✅ / 多账号待做" />
          </div>
        </Section>

        {/* 团队 */}
        <Section title="Agent 团队状态">
          <div style={{ fontSize: 13, color: "#86868b", marginBottom: 12 }}>你只需跟 <code style={{ background: "#f0f4ff", color: "#007aff", padding: "1px 6px", borderRadius: 4 }}>/ops-pm</code> 沟通，PM 调度所有人。</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            <AgentCard name="PM 项目经理" cmd="/ops-pm" status="运转中" color="#1d1d1f" />
            <AgentCard name="增长专家" cmd="/ops-growth" status="README ✅ awesome 4PR" color="#ff9500" />
            <AgentCard name="内容运营" cmd="/ops-content" status="小红书已发 + 5待发" color="#007aff" />
            <AgentCard name="社区运营" cmd="/ops-community" status="14 PR open" color="#34c759" />
            <AgentCard name="数据运营" cmd="/ops-data" status="基线报告 ✅" color="#af52de" />
            <AgentCard name="产品审视" cmd="/ops-product-review" status="21/30 分" color="#ff3b30" />
          </div>
        </Section>

        {/* 时间线 */}
        <Section title="这两天做了什么">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <TimelineItem day="Day 1 (3.18)" items={["从录音到产品上线", "Phase 0-3 完成", "20 Skill + 精选库 2004 + 安全 v2 + 工具链"]} status="done" />
            <TimelineItem day="Day 2 (3.19)" items={["50 Skill 达标 + 精选库 5005", "运营体系建立（6 Agent + PM + SOP）", "6 篇推广内容 + 产品审视 + 断裂点修复"]} status="done" />
            <TimelineItem day="Day 3 (3.20)" items={["首篇小红书发布 ✅", "全链路打通：写→去AI味→发布", "等待安装量数据"]} status="active" />
          </div>
        </Section>

        {/* Skill 概览 */}
        <Section title={`卫星 Skill 矩阵（${allSkills.length} 个）`}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {allSkills.map((s) => (
              <Link key={s.slug} href={`/skills/${s.slug}`} style={{ textDecoration: "none" }}>
                <span style={{
                  fontSize: 12, padding: "4px 10px", borderRadius: 980,
                  background: s.type === "original" ? "#fff0f5" : "#f0faf4",
                  color: s.type === "original" ? "#ff2d55" : "#1a7f37",
                  border: `1px solid ${s.type === "original" ? "#ffe0ea" : "#d4edda"}`,
                }}>{s.name}</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "#86868b" }}>
            <span style={{ color: "#ff2d55" }}>●</span> 原创 {allSkills.filter(s=>s.type==="original").length} 个
            &nbsp;&nbsp;
            <span style={{ color: "#1a7f37" }}>●</span> 增强 {allSkills.filter(s=>s.type==="enhanced").length} 个
          </div>
        </Section>

        {/* 竞品 */}
        <Section title="竞争格局">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {competitors.map((c, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 14, padding: 16,
                boxShadow: "0 0 0 1px rgba(0,0,0,.04)",
                borderTop: "ours" in c ? "3px solid #34c759" : "none",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "ours" in c ? "#34c759" : "#1d1d1f", marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#86868b", marginBottom: 8 }}>{c.sub}</div>
                <CompBar label="中文" pct={c.chinese} />
                <CompBar label="安全" pct={c.safety} />
              </div>
            ))}
          </div>
        </Section>

        {/* Roadmap 精简 */}
        <Section title="Roadmap">
          <div style={{ display: "flex", gap: 8 }}>
            {phases.map((p) => (
              <div key={p.id} style={{
                flex: 1, padding: "12px 14px", borderRadius: 12, textAlign: "center",
                background: p.status === "done" ? "#34c759" : p.status === "active" ? "#fff8e6" : "#f5f5f7",
                color: p.status === "done" ? "#fff" : p.status === "active" ? "#856404" : "#86868b",
                fontSize: 11, fontWeight: 600,
              }}>
                {p.name.split("·")[0].trim()}
                <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2 }}>{p.progress}/{p.total}</div>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}

/* ===== Components ===== */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, letterSpacing: -.2 }}>{title}</h2>
      {children}
    </div>
  );
}

function KeyCard({ title, value, unit, color, details }: { title: string; value: string; unit: string; color: string; details: string[] }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 18px", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)" }}>
      <div style={{ fontSize: 13, color: "#86868b", fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
        <span style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: -1 }}>{value}</span>
        <span style={{ fontSize: 14, color: "#86868b" }}>{unit}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {details.map((d, i) => (
          <div key={i} style={{ fontSize: 12, color: d.startsWith("✅") ? "#1a7f37" : d.startsWith("⬜") ? "#86868b" : "#424245", lineHeight: 1.4 }}>{d}</div>
        ))}
      </div>
    </div>
  );
}

function OkrRow({ label, status, pct, detail }: { label: string; status: "done" | "partial" | "blocked" | "todo"; pct: number; detail: string }) {
  const color = status === "done" ? "#34c759" : status === "partial" ? "#ff9500" : status === "blocked" ? "#ff3b30" : "#86868b";
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", boxShadow: "0 0 0 1px rgba(0,0,0,.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "#f0f0f2", borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: color }} />
      </div>
      <div style={{ fontSize: 11, color: "#86868b" }}>{detail}</div>
    </div>
  );
}

function AgentCard({ name, cmd, status, color }: { name: string; cmd: string; status: string; color: string }) {
  return (
    <div style={{ background: "#fff", borderLeft: `3px solid ${color}`, borderRadius: 10, padding: "12px 14px", boxShadow: "0 0 0 1px rgba(0,0,0,.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
        <code style={{ fontSize: 10, color: "#007aff", background: "#f0f4ff", padding: "1px 6px", borderRadius: 4 }}>{cmd}</code>
      </div>
      <div style={{ fontSize: 12, color: "#34c759" }}>{status}</div>
    </div>
  );
}

function TimelineItem({ day, items, status }: { day: string; items: string[]; status: "done" | "active" }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 10, padding: "12px 16px",
      borderLeft: `3px solid ${status === "done" ? "#34c759" : "#ff9500"}`,
      boxShadow: "0 0 0 1px rgba(0,0,0,.04)",
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{day}</div>
      <div style={{ fontSize: 12, color: "#86868b" }}>{items.join(" → ")}</div>
    </div>
  );
}

function CompBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
      <span style={{ fontSize: 10, color: "#86868b", width: 28 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: "#f0f0f2", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: pct > 80 ? "#34c759" : "#007aff" }} />
      </div>
      <span style={{ fontSize: 10, color: "#86868b", width: 28 }}>{pct}%</span>
    </div>
  );
}
