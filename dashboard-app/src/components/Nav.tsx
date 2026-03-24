"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSkill = pathname.startsWith("/skills");
  const isLeaderboard = pathname === "/leaderboard";
  const isSubmit = pathname === "/submit";

  return (
    <nav style={{
      padding: "0 24px",
      height: 52,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "rgba(255,255,255,.72)",
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      borderBottom: "1px solid rgba(0,0,0,.08)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", letterSpacing: -.3 }}>技能宝</span>
        </Link>
        <div style={{ display: "flex", gap: 2 }}>
          <NavLink href="/" active={isHome}>发现</NavLink>
          <NavLink href="/skills" active={isSkill}>搜索技能</NavLink>
          <NavLink href="/leaderboard" active={isLeaderboard}>排行榜</NavLink>
          <NavLink href="/submit" active={isSubmit}>提交收录</NavLink>
        </div>
      </div>
      <a href="https://github.com/mindverse/skillhub" target="_blank" rel="noopener noreferrer"
        style={{ fontSize: 13, color: "#86868b", textDecoration: "none", padding: "5px 12px", borderRadius: 980, border: "1px solid #e5e5ea", transition: "all .15s" }}>
        GitHub
      </a>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      fontSize: 14, fontWeight: active ? 600 : 400, textDecoration: "none",
      padding: "6px 14px", borderRadius: 980,
      color: active ? "#1d1d1f" : "#86868b",
      background: active ? "rgba(0,0,0,.05)" : "transparent",
      transition: "all .15s",
    }}>
      {children}
    </Link>
  );
}
