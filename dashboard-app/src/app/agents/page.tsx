import Link from "next/link";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export const revalidate = 10; // 10秒刷新一次，近实时

// 读取所有 ops agent 的状态
async function getAgentStates() {
  const skillsDir = path.join(process.env.HOME || "/Users/baofangyi", ".claude/skills");
  const opsAgents = [
    { id: "ops-pm", name: "PM 项目经理", color: "#1d1d1f", emoji: "🎯" },
    { id: "ops-growth", name: "增长专家", color: "#ff9500", emoji: "📈" },
    { id: "ops-content", name: "内容运营", color: "#007aff", emoji: "✍️" },
    { id: "ops-community", name: "社区运营", color: "#34c759", emoji: "🌐" },
    { id: "ops-data", name: "数据运营", color: "#af52de", emoji: "📊" },
    { id: "ops-product-manager", name: "产品经理", color: "#ff2d55", emoji: "🎨" },
    { id: "ops-product-review", name: "产品审视", color: "#ff3b30", emoji: "🔍" },
    { id: "ops-tech", name: "技术开发", color: "#5ac8fa", emoji: "🛠" },
  ];

  const agents = opsAgents.map((a) => {
    const skillPath = path.join(skillsDir, a.id, "SKILL.md");
    let content = "";
    let lines = 0;
    let lastModified = "";
    let description = "";
    let version = "";
    let hasMessageBoard = false;
    let hasSharedContext = false;

    try {
      content = fs.readFileSync(skillPath, "utf-8");
      lines = content.split("\n").length;
      const stat = fs.statSync(skillPath);
      lastModified = stat.mtime.toISOString();

      // Extract description
      const descMatch = content.match(/description:\s*"([^"]+)"/);
      if (descMatch) description = descMatch[1].slice(0, 80) + "...";

      // Extract version
      const verMatch = content.match(/version:\s*"([^"]+)"/);
      if (verMatch) version = verMatch[1];

      // Check capabilities
      hasMessageBoard = content.includes("消息板");
      hasSharedContext = content.includes("work-log");
    } catch {
      // Agent doesn't exist
    }

    return { ...a, lines, lastModified, description, version, hasMessageBoard, hasSharedContext, content };
  });

  return agents;
}

// 读取消息板
async function getMessageBoard() {
  try {
    const boardPath = "/Users/baofangyi/mono/skillhub/tracking/message-board.md";
    const content = fs.readFileSync(boardPath, "utf-8");
    const lines = content.split("\n").filter(l => l.includes("🔵") || l.includes("🔴"));
    return lines.map(l => {
      const parts = l.split("|").map(s => s.trim()).filter(Boolean);
      if (parts.length >= 6) {
        return { time: parts[0], from: parts[1], to: parts[2], type: parts[3], content: parts[4], status: parts[5] };
      }
      return null;
    }).filter(Boolean);
  } catch {
    return [];
  }
}

// 读取最近工作日志
async function getRecentLogs() {
  try {
    const logPath = "/Users/baofangyi/mono/skillhub/tracking/work-log.md";
    const content = fs.readFileSync(logPath, "utf-8");
    const lines = content.split("\n").filter(l => l.startsWith("|") && !l.startsWith("| 时间") && !l.startsWith("|--") && !l.startsWith("| #") && l.includes("|"));
    return lines.slice(-15).reverse();
  } catch {
    return [];
  }
}

export default async function AgentsPage() {
  const agents = await getAgentStates();
  const messages = await getMessageBoard();
  const logs = await getRecentLogs();

  const pendingCount = messages.filter(m => m?.status?.includes("🔵")).length;
  const blockedCount = messages.filter(m => m?.status?.includes("🔴")).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
      {/* Header */}
      <header style={{
        padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,.72)", backdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,.08)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>技能宝</span>
          <span style={{ fontSize: 13, padding: "2px 10px", borderRadius: 980, background: "#e8faf0", color: "#34c759" }}>Agent 管理</span>
          <span style={{ fontSize: 11, color: "#86868b" }}>每 10 秒自动刷新</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/pm" style={{ fontSize: 13, color: "#86868b", textDecoration: "none" }}>PM 面板</Link>
          <Link href="/dashboard" style={{ fontSize: 13, color: "#86868b", textDecoration: "none" }}>CEO</Link>
          <Link href="/" style={{ fontSize: 13, color: "#007aff", textDecoration: "none" }}>前台</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>

        {/* Live status bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <StatusPill label="Agent 总数" value={agents.length.toString()} color="#007aff" />
          <StatusPill label="消息待处理" value={pendingCount.toString()} color={pendingCount > 0 ? "#ff9500" : "#34c759"} />
          <StatusPill label="阻塞" value={blockedCount.toString()} color={blockedCount > 0 ? "#ff3b30" : "#34c759"} />
          <StatusPill label="有消息板" value={`${agents.filter(a => a.hasMessageBoard).length}/${agents.length}`} color="#34c759" />
          <StatusPill label="有共享上下文" value={`${agents.filter(a => a.hasSharedContext).length}/${agents.length}`} color="#34c759" />
        </div>

        {/* Message Board - Live */}
        <Section title="消息板（实时）" sub="Agent 之间的通信，🔵待处理 🔴阻塞">
          {messages.length === 0 ? (
            <div style={{ fontSize: 14, color: "#86868b", padding: 20, textAlign: "center" }}>消息板为空</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {messages.map((m, i) => m && (
                <div key={i} style={{
                  background: "#fff", borderRadius: 10, padding: "10px 14px",
                  borderLeft: `3px solid ${m.status?.includes("🔴") ? "#ff3b30" : "#ff9500"}`,
                  boxShadow: "0 0 0 1px rgba(0,0,0,.04)",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13,
                }}>
                  <span style={{ color: "#86868b", width: 40, flexShrink: 0 }}>{m.time}</span>
                  <span style={{ fontWeight: 600, width: 80, flexShrink: 0 }}>{m.from}</span>
                  <span style={{ color: "#86868b" }}>→</span>
                  <span style={{ width: 60, flexShrink: 0 }}>{m.to}</span>
                  <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, background: m.type === "done" ? "#e8faf0" : m.type === "blocked" ? "#fff0f0" : "#eef2ff", color: m.type === "done" ? "#34c759" : m.type === "blocked" ? "#ff3b30" : "#007aff" }}>{m.type}</span>
                  <span style={{ flex: 1, color: "#424245" }}>{m.content}</span>
                  <span>{m.status}</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Agent Cards */}
        <Section title="Agent 状态" sub="每个 Agent 的配置、能力、最近修改时间">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {agents.map((a) => (
              <div key={a.id} style={{
                background: "#fff", borderRadius: 14, padding: "16px 18px",
                borderLeft: `3px solid ${a.color}`,
                boxShadow: "0 1px 3px rgba(0,0,0,.04)",
              }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 20 }}>{a.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{a.name}</span>
                  </div>
                  <code style={{ fontSize: 10, color: "#007aff", background: "#f0f4ff", padding: "1px 6px", borderRadius: 4 }}>/{a.id}</code>
                </div>

                {/* Description */}
                <p style={{ fontSize: 11, color: "#86868b", margin: "0 0 8px", lineHeight: 1.4 }}>{a.description || "无描述"}</p>

                {/* Stats */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <Tag label={`${a.lines} 行`} color="#86868b" />
                  <Tag label={`v${a.version || "?"}`} color="#86868b" />
                  {a.hasMessageBoard && <Tag label="消息板 ✓" color="#34c759" />}
                  {a.hasSharedContext && <Tag label="共享上下文 ✓" color="#34c759" />}
                  {!a.hasMessageBoard && <Tag label="无消息板" color="#ff3b30" />}
                </div>

                {/* Last modified */}
                <div style={{ fontSize: 11, color: "#86868b" }}>
                  最后修改：{a.lastModified ? new Date(a.lastModified).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }) : "未知"}
                </div>

                {/* File path */}
                <div style={{ fontSize: 10, color: "#c7c7cc", marginTop: 4, fontFamily: "monospace" }}>
                  ~/.claude/skills/{a.id}/SKILL.md
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Recent Activity */}
        <Section title="最近动态" sub="work-log 最近 15 条记录（倒序）">
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
            {logs.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "#86868b" }}>暂无日志</div>
            ) : (
              <div style={{ fontSize: 12, fontFamily: "monospace" }}>
                {logs.map((log, i) => (
                  <div key={i} style={{ padding: "8px 14px", borderBottom: "1px solid #f0f0f2", color: "#424245", lineHeight: 1.5 }}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* How to update */}
        <Section title="如何管理 Agent" sub="">
          <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,.04)", fontSize: 13, color: "#424245", lineHeight: 1.8 }}>
            <p style={{ margin: "0 0 8px" }}><strong>查看状态：</strong>本页每 10 秒自动刷新</p>
            <p style={{ margin: "0 0 8px" }}><strong>更新能力：</strong>编辑 <code style={{ background: "#f5f5f7", padding: "1px 4px", borderRadius: 3 }}>~/.claude/skills/[agent-id]/SKILL.md</code> 或告诉 PM &quot;给 [agent] 加 [能力]&quot;</p>
            <p style={{ margin: "0 0 8px" }}><strong>查看通信：</strong>消息板区域展示 Agent 间的所有消息</p>
            <p style={{ margin: "0 0 8px" }}><strong>自动推进：</strong><code style={{ background: "#f5f5f7", padding: "1px 4px", borderRadius: 3 }}>/loop 30m /ops-pm 巡检消息板并执行</code></p>
            <p style={{ margin: 0 }}><strong>手动推进：</strong><code style={{ background: "#f5f5f7", padding: "1px 4px", borderRadius: 3 }}>/ops-pm</code> 然后告诉它你要什么</p>
          </div>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
        {sub && <span style={{ fontSize: 12, color: "#86868b" }}>{sub}</span>}
      </div>
      {children}
    </div>
  );
}

function StatusPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", boxShadow: "0 0 0 1px rgba(0,0,0,.04)", flex: 1, textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#86868b" }}>{label}</div>
    </div>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: `${color}15`, color, fontWeight: 500 }}>{label}</span>
  );
}
