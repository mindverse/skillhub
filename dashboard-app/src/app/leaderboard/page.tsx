import Nav from "@/components/Nav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

const gradeColor: Record<string, string> = { S: "#30b0c7", A: "#34c759", B: "#ff9500", C: "#86868b", D: "#ff3b30" };

async function getLeaderboardData() {
  const [
    { data: byStars },
    { data: bySafety },
    { data: ourBest },
  ] = await Promise.all([
    supabase.from("skills")
      .select("slug,name,name_zh,description_zh,description,category_zh,safety_score,safety_level,github_stars,install_count,is_ours,author_name,repo_full_name")
      .order("github_stars", { ascending: false })
      .limit(20),
    supabase.from("skills")
      .select("slug,name,name_zh,description_zh,description,category_zh,safety_score,safety_level,github_stars,install_count,is_ours,author_name")
      .order("safety_score", { ascending: false })
      .limit(20),
    supabase.from("skills")
      .select("slug,name,name_zh,description_zh,description,category_zh,safety_score,safety_level,github_stars,install_count,is_ours,author_name")
      .eq("is_ours", true)
      .order("safety_score", { ascending: false })
      .limit(10),
  ]);
  return {
    byStars: byStars || [],
    bySafety: bySafety || [],
    ourBest: ourBest || [],
  };
}

export default async function LeaderboardPage() {
  const { byStars, bySafety, ourBest } = await getLeaderboardData();

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
      <Nav />
      <div style={{ padding: "32px 24px 64px", maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: -.3 }}>排行榜</h1>
        <p style={{ fontSize: 16, color: "#86868b", marginBottom: 32 }}>全网最热门、最安全的 AI 技能排名</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Stars leaderboard */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Stars 最多</h2>
            <LeaderboardList skills={byStars} metric="stars" />
          </div>

          {/* Safety leaderboard */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>安全分最高</h2>
            <LeaderboardList skills={bySafety} metric="safety" />
          </div>
        </div>

        {/* Our best */}
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>官方精选 TOP 10</h2>
          <LeaderboardList skills={ourBest} metric="safety" />
        </section>
      </div>
    </div>
  );
}

interface LeaderboardSkill {
  slug: string;
  name: string;
  name_zh: string | null;
  description_zh: string | null;
  description: string | null;
  category_zh: string | null;
  safety_score: number;
  safety_level: string;
  github_stars: number;
  install_count: number;
  is_ours: boolean;
  author_name: string | null;
  repo_full_name?: string | null;
}

function LeaderboardList({ skills, metric }: { skills: LeaderboardSkill[]; metric: "stars" | "safety" }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)" }}>
      {skills.map((s, i) => (
        <Link key={s.slug} href={`/skills/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
            borderBottom: i < skills.length - 1 ? "1px solid #f0f0f2" : "none",
            cursor: "pointer", transition: "background .1s",
          }}>
            <span style={{
              fontSize: 15, fontWeight: 700, width: 28, textAlign: "center",
              color: i < 3 ? "#ff9500" : "#86868b",
            }}>
              #{i + 1}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.name_zh || s.name}
                </span>
                {s.is_ours && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, background: "#fff0f5", color: "#ff2d55", fontWeight: 500, flexShrink: 0 }}>精选</span>}
              </div>
              <div style={{ fontSize: 12, color: "#86868b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.author_name || ""} · {s.category_zh || ""}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {metric === "stars" ? (
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f" }}>{s.github_stars.toLocaleString()}</span>
              ) : (
                <span style={{ fontSize: 14, fontWeight: 600, color: gradeColor[s.safety_level] || "#86868b" }}>{s.safety_score}</span>
              )}
              <div style={{ fontSize: 11, color: "#86868b" }}>{metric === "stars" ? "stars" : s.safety_level + "级"}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
