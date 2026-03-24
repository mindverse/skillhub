"use client";
import Nav from "@/components/Nav";
import { useState } from "react";

export default function SubmitPage() {
  const [repo, setRepo] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!repo.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/skills/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_full_name: repo.trim(),
          submitted_by: name.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setRepo("");
        setNotes("");
      } else {
        setStatus("error");
        setMessage(data.error || "提交失败，请稍后重试");
      }
    } catch {
      setStatus("error");
      setMessage("网络错误，请稍后重试");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
      <Nav />
      <div style={{ padding: "32px 24px 64px", maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: -.3 }}>提交你的 Skill</h1>
        <p style={{ fontSize: 16, color: "#86868b", marginBottom: 32 }}>
          把你的 GitHub 仓库提交给技能宝收录。我们会审核并添加到搜索引擎中。
        </p>

        {/* Requirements */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "24px", marginBottom: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)",
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>收录要求</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: "#424245" }}>
            <div style={{ display: "flex", gap: 10 }}><span style={{ color: "#34c759" }}>&#10003;</span> 仓库中包含 SKILL.md 文件</div>
            <div style={{ display: "flex", gap: 10 }}><span style={{ color: "#34c759" }}>&#10003;</span> SKILL.md 有 frontmatter（name, description）</div>
            <div style={{ display: "flex", gap: 10 }}><span style={{ color: "#34c759" }}>&#10003;</span> 开源许可证（MIT / Apache 推荐）</div>
            <div style={{ display: "flex", gap: 10 }}><span style={{ color: "#34c759" }}>&#10003;</span> 无恶意代码、无数据收集行为</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: "#fff", borderRadius: 16, padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)",
        }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>GitHub 仓库 *</label>
            <input
              type="text"
              placeholder="owner/repo（例如 mindverse/skillhub）"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                border: "1px solid #e5e5ea", fontSize: 15, color: "#1d1d1f",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>你的名字（选填）</label>
            <input
              type="text"
              placeholder="GitHub 用户名或昵称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                border: "1px solid #e5e5ea", fontSize: 15, color: "#1d1d1f",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>备注（选填）</label>
            <textarea
              placeholder="关于这个 Skill 的补充说明..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                border: "1px solid #e5e5ea", fontSize: 15, color: "#1d1d1f",
                resize: "vertical", fontFamily: "inherit",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !repo.trim()}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: status === "loading" ? "#86868b" : "#007aff",
              color: "#fff", fontSize: 16, fontWeight: 600, cursor: status === "loading" ? "wait" : "pointer",
            }}
          >
            {status === "loading" ? "提交中..." : "提交收录"}
          </button>

          {/* Status message */}
          {status === "success" && (
            <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "#e8f5e8", color: "#34c759", fontSize: 14, fontWeight: 500 }}>
              {message}
            </div>
          )}
          {status === "error" && (
            <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "#fff0f0", color: "#ff3b30", fontSize: 14, fontWeight: 500 }}>
              {message}
            </div>
          )}
        </form>

        {/* CLI alternative */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#86868b", marginBottom: 8 }}>也可以通过命令行提交：</p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#1d1d1f", borderRadius: 10, padding: "12px 20px",
          }}>
            <span style={{ color: "#86868b", fontSize: 14 }}>$</span>
            <code style={{ fontSize: 14, color: "#fff", fontFamily: "'SF Mono', Menlo, monospace" }}>npx jinengbao submit owner/repo</code>
          </div>
        </div>
      </div>
    </div>
  );
}
