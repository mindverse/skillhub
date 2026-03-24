import Link from "next/link";

// Agent definitions with real interaction data
const agents = [
  {
    id: "pm", name: "PM 项目经理", cmd: "/ops-pm", color: "#1d1d1f",
    role: "诊断 → 调度 → 汇报", calls: 12, outputs: 8,
    interactions: [
      { to: "content", type: "调度", detail: "写小红书 x5", status: "done" },
      { to: "growth", type: "调度", detail: "README SEO + awesome PR", status: "done" },
      { to: "product-manager", type: "调度", detail: "首页优化 x3 轮", status: "done" },
      { to: "product-review", type: "调度", detail: "产品审视", status: "done" },
      { to: "data", type: "调度", detail: "基线报告", status: "done" },
      { to: "tech", type: "调度", detail: "Skill 开发 + SEO", status: "done" },
      { to: "community", type: "查询", detail: "PR 状态检查", status: "done" },
    ],
    bottleneck: null,
  },
  {
    id: "content", name: "内容运营", cmd: "/ops-content", color: "#007aff",
    role: "写内容 → humanizer → 发布", calls: 8, outputs: 11,
    interactions: [
      { to: "humanizer", type: "调用", detail: "去 AI 味 x3 篇", status: "done" },
      { to: "post-to-xhs", type: "调用", detail: "发布小红书 x2", status: "done" },
      { to: "pm", type: "上报", detail: "6篇内容就绪", status: "done" },
    ],
    bottleneck: "小红书频率限制（每天≤2篇），3篇待发",
  },
  {
    id: "growth", name: "增长专家", cmd: "/ops-growth", color: "#ff9500",
    role: "渠道分析 → 策略 → 投放", calls: 2, outputs: 3,
    interactions: [
      { to: "pm", type: "交付", detail: "README + 4 awesome PR + Topics", status: "done" },
      { to: "content", type: "协同", detail: "提供渠道列表给内容运营", status: "done" },
    ],
    bottleneck: "awesome PR 等合并（0/4），安装量仍为 0",
  },
  {
    id: "community", name: "社区运营", cmd: "/ops-community", color: "#34c759",
    role: "PR 跟进 → 外联 → 社区", calls: 0, outputs: 0,
    interactions: [
      { to: "pm", type: "被查询", detail: "PM 直接查 PR 状态", status: "done" },
    ],
    bottleneck: "从未被正式调用过，PM 绕过它直接查 gh CLI",
  },
  {
    id: "data", name: "数据运营", cmd: "/ops-data", color: "#af52de",
    role: "采集数据 → 分析 → 报告", calls: 1, outputs: 2,
    interactions: [
      { to: "pm", type: "交付", detail: "基线报告 + 10 指标", status: "done" },
    ],
    bottleneck: "安装量=0 导致无数据可追踪，周报机制未建立",
  },
  {
    id: "product-manager", name: "产品经理", cmd: "/ops-product-manager", color: "#ff2d55",
    role: "User Journey → 优化 → 转化率", calls: 3, outputs: 4,
    interactions: [
      { to: "pm", type: "交付", detail: "首页优化 3 轮", status: "done" },
      { to: "tech", type: "需求", detail: "首页代码修改", status: "done" },
    ],
    bottleneck: "转化率无法测量（无用户数据）",
  },
  {
    id: "product-review", name: "产品审视", cmd: "/ops-product-review", color: "#ff3b30",
    role: "用户视角 → 找断裂点 → 修复", calls: 2, outputs: 2,
    interactions: [
      { to: "pm", type: "交付", detail: "21/30 审视报告 + 6 断裂点", status: "done" },
      { to: "tech", type: "需求", detail: "3 个断裂点需修复", status: "done" },
    ],
    bottleneck: "与产品经理职责重叠，需合并",
  },
  {
    id: "tech", name: "技术开发", cmd: "/ops-tech", color: "#5ac8fa",
    role: "写代码 → 测试 → 推送", calls: 6, outputs: 25,
    interactions: [
      { to: "pm", type: "交付", detail: "70 Skill + CLI + 安全评分 + SEO", status: "done" },
      { to: "product-review", type: "触发", detail: "修复断裂点后需审视", status: "done" },
    ],
    bottleneck: "NPM 发布阻塞于 2FA",
  },
];

// Bottleneck summary
const bottlenecks = [
  { severity: "high", area: "O1 安装量", detail: "安装量 = 0。小红书 2 篇已发但数据未回。其余渠道（掘金/V2EX/知乎）内容写好未发。", owner: "CEO + 增长" },
  { severity: "high", area: "社区运营", detail: "Agent 从未被正式调用。PM 绕过它直接用 gh CLI 查 PR。角色形同虚设。", owner: "PM 需重新设计" },
  { severity: "medium", area: "数据", detail: "无用户数据导致转化率、点击率等 KR 无法测量。数据运营处于空转状态。", owner: "数据运营" },
  { severity: "medium", area: "产品", detail: "产品经理和产品审视职责重叠，两个 Agent 做类似的事。", owner: "PM 合并计划中" },
  { severity: "low", area: "NPM 发布", detail: "CLI 工具 NPM 发布阻塞于 2FA Passkey。CEO 需终端手动发布。", owner: "CEO" },
  { severity: "low", area: "绩效追踪", detail: "agent-performance.md 数据滞后。PM 执行时忘记更新。", owner: "PM" },
];

export default function PMPanel() {
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
          <span style={{ fontSize: 13, padding: "2px 10px", borderRadius: 980, background: "#eef2ff", color: "#007aff" }}>PM 面板</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/dashboard" style={{ fontSize: 13, color: "#86868b", textDecoration: "none" }}>CEO 面板</Link>
          <Link href="/" style={{ fontSize: 13, color: "#007aff", textDecoration: "none" }}>前台</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Section 1: Bottlenecks first (金字塔原则) */}
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>业务卡点</h1>
        <p style={{ fontSize: 14, color: "#86868b", marginBottom: 20 }}>按严重性排序，解决卡点 = 推动 OKR</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
          {bottlenecks.map((b, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 12, padding: "14px 18px",
              borderLeft: `3px solid ${b.severity === "high" ? "#ff3b30" : b.severity === "medium" ? "#ff9500" : "#86868b"}`,
              boxShadow: "0 1px 3px rgba(0,0,0,.04)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 980, fontWeight: 600,
                    background: b.severity === "high" ? "#fff0f0" : b.severity === "medium" ? "#fff8e6" : "#f5f5f7",
                    color: b.severity === "high" ? "#ff3b30" : b.severity === "medium" ? "#ff9500" : "#86868b",
                  }}>{b.severity === "high" ? "严重" : b.severity === "medium" ? "中等" : "低"}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{b.area}</span>
                </div>
                <span style={{ fontSize: 12, color: "#86868b" }}>{b.owner}</span>
              </div>
              <p style={{ fontSize: 13, color: "#424245", margin: 0, lineHeight: 1.5 }}>{b.detail}</p>
            </div>
          ))}
        </div>

        {/* Section 2: Agent interaction map */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Agent 协作流</h2>
        <p style={{ fontSize: 14, color: "#86868b", marginBottom: 20 }}>谁调用了谁、交付了什么、卡在哪</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14, marginBottom: 40 }}>
          {agents.map((a) => (
            <div key={a.id} style={{
              background: "#fff", borderRadius: 14, padding: "18px 20px",
              borderLeft: `3px solid ${a.color}`,
              boxShadow: "0 1px 3px rgba(0,0,0,.04)",
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{a.name}</span>
                  <code style={{ fontSize: 10, color: "#007aff", background: "#f0f4ff", padding: "1px 6px", borderRadius: 4, marginLeft: 6 }}>{a.cmd}</code>
                </div>
                <div style={{ fontSize: 11, color: "#86868b" }}>
                  {a.calls} 次调用 · {a.outputs} 产出
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#86868b", marginBottom: 10 }}>{a.role}</div>

              {/* Interactions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                {a.interactions.map((int, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <span style={{
                      padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: int.type === "调度" ? "#eef2ff" : int.type === "调用" ? "#e8faf0" : int.type === "交付" ? "#fff8e6" : "#f5f5f7",
                      color: int.type === "调度" ? "#007aff" : int.type === "调用" ? "#34c759" : int.type === "交付" ? "#ff9500" : "#86868b",
                    }}>{int.type}</span>
                    <span style={{ color: "#424245" }}>→ {int.to}</span>
                    <span style={{ color: "#86868b", flex: 1 }}>{int.detail}</span>
                    <span style={{ color: int.status === "done" ? "#34c759" : int.status === "blocked" ? "#ff3b30" : "#ff9500" }}>
                      {int.status === "done" ? "✓" : int.status === "blocked" ? "✗" : "◐"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottleneck */}
              {a.bottleneck && (
                <div style={{ fontSize: 12, color: "#ff3b30", padding: "6px 10px", background: "#fff0f0", borderRadius: 8 }}>
                  卡点：{a.bottleneck}
                </div>
              )}
              {!a.bottleneck && (
                <div style={{ fontSize: 12, color: "#34c759", padding: "6px 10px", background: "#e8faf0", borderRadius: 8 }}>
                  无卡点
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section 3: Collaboration flow diagram */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>协作流向图</h2>
        <p style={{ fontSize: 14, color: "#86868b", marginBottom: 20 }}>箭头 = 调度/调用关系</p>

        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,.04)", marginBottom: 40 }}>
          <pre style={{ fontSize: 13, lineHeight: 1.8, margin: 0, fontFamily: "'SF Mono', Menlo, monospace", color: "#424245", overflowX: "auto" }}>
{`CEO
 │
 └── PM ──┬── 增长专家 ──→ README/awesome PR
          │      └── (渠道策略) ──→ 内容运营
          │
          ├── 内容运营 ──→ humanizer-zh ──→ post-to-xhs
          │      └── (6篇内容) ──→ 5篇小红书已发
          │                        3篇其他平台待 CEO 发
          │
          ├── 产品经理 ──→ 首页优化 x3 轮
          │      └── (需求) ──→ 技术开发 ──→ 代码修改 ──→ Vercel 部署
          │
          ├── 产品审视 ──→ 断裂点报告
          │      └── (修复需求) ──→ 技术开发
          │
          ├── 数据运营 ──→ 基线报告（但无用户数据可追踪）
          │
          ├── 社区运营 ──→ ⚠️ 未被调用（PM 直接查 gh CLI）
          │
          └── 技术开发 ──→ 70 Skill + CLI + 安全v2 + SEO
                 └── NPM 发布 ──→ ⚠️ 阻塞于 2FA`}
          </pre>
        </div>

        {/* Section 4: Evolution status */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>团队演化状态</h2>
        <p style={{ fontSize: 14, color: "#86868b", marginBottom: 20 }}>发现的问题和修复进度</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
          {[
            { issue: "Agent 之间信息孤岛", fix: "所有 Agent 加 Step 0 读 work-log", status: "done" },
            { issue: "ops-tech 太薄（69行）", fix: "注入项目结构 + 发布流程知识", status: "done" },
            { issue: "PM 太胖自己执行", fix: "瘦身为只做诊断+调度+汇报", status: "planned" },
            { issue: "产品经理/审视重叠", fix: "合并为 /ops-product 双模式", status: "planned" },
            { issue: "ops-community 形同虚设", fix: "加主动任务（bump/外联/Discussion）", status: "planned" },
            { issue: "绩效追踪没跟上", fix: "PM 每次调度后自动追加日志", status: "planned" },
            { issue: "OKR 数据散在多处", fix: "单一数据源，面板从 API 读", status: "planned" },
          ].map((e, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 10, padding: "12px 16px",
              borderLeft: `3px solid ${e.status === "done" ? "#34c759" : "#ff9500"}`,
              boxShadow: "0 0 0 1px rgba(0,0,0,.04)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{e.issue}</div>
              <div style={{ fontSize: 12, color: "#86868b", marginBottom: 4 }}>{e.fix}</div>
              <span style={{
                fontSize: 10, padding: "1px 8px", borderRadius: 980,
                background: e.status === "done" ? "#e8faf0" : "#fff8e6",
                color: e.status === "done" ? "#34c759" : "#ff9500",
                fontWeight: 600,
              }}>{e.status === "done" ? "已修复" : "计划中"}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
