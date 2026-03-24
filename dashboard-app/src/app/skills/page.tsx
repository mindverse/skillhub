"use client";
import Nav from "@/components/Nav";
import Link from "next/link";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { SkillRow } from "@/lib/supabase";

const gradeColor: Record<string, string> = { S: "#30b0c7", A: "#34c759", B: "#ff9500", C: "#86868b", D: "#ff3b30" };
const safetyLevels = ["全部", "S", "A", "B", "C"];

function SkillsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get("q") || "";
  const initialCat = searchParams.get("category") || "全部";
  const initialSafety = searchParams.get("safety") || "全部";
  const initialSort = searchParams.get("sort") || "relevance";
  const initialOurs = searchParams.get("ours") === "true";
  const initialPage = parseInt(searchParams.get("page") || "1");

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState(initialCat);
  const [safety, setSafety] = useState(initialSafety);
  const [sort, setSort] = useState(initialSort);
  const [oursOnly, setOursOnly] = useState(initialOurs);
  const [page, setPage] = useState(initialPage);
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ slug: string; name_zh: string; skill_count: number }[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/skills/categories")
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "全部") params.set("category", category);
    if (safety !== "全部") params.set("safety", safety);
    if (sort !== "relevance") params.set("sort", sort);
    if (oursOnly) params.set("ours", "true");
    params.set("page", String(page));
    params.set("pageSize", "20");

    try {
      const res = await fetch(`/api/skills?${params}`);
      const data = await res.json();
      setSkills(data.skills || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch {
      setSkills([]);
    }
    setLoading(false);
  }, [query, category, safety, sort, oursOnly, page]);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  // Update URL on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "全部") params.set("category", category);
    if (safety !== "全部") params.set("safety", safety);
    if (sort !== "relevance") params.set("sort", sort);
    if (oursOnly) params.set("ours", "true");
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/skills${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [query, category, safety, sort, oursOnly, page, router]);

  // Debounced search
  const [debouncedQ, setDebouncedQ] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => { setQuery(debouncedQ); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [debouncedQ]);

  const categoryList = ["全部", ...categories.map(c => c.name_zh)];

  return (
    <>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="搜索技能... 输入中文或英文关键词"
          value={debouncedQ}
          onChange={(e) => setDebouncedQ(e.target.value)}
          autoFocus
          style={{
            width: "100%", padding: "16px 20px 16px 48px", borderRadius: 14,
            background: "#fff", border: "1px solid #e5e5ea", color: "#1d1d1f",
            fontSize: 17, boxShadow: "0 2px 8px rgba(0,0,0,.06)",
          }}
        />
        <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#86868b" }}>&#128269;</span>
      </div>

      {/* Filters row */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        {/* Categories */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
          {categoryList.map((cat) => {
            const active = category === cat;
            const count = cat === "全部" ? total : categories.find(c => c.name_zh === cat)?.skill_count;
            return (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }} style={{
                padding: "7px 14px", borderRadius: 980, fontSize: 13, cursor: "pointer",
                border: "none",
                background: active ? "#1d1d1f" : "#e8e8ed",
                color: active ? "#fff" : "#424245",
                fontWeight: active ? 600 : 400,
                transition: "all .15s",
              }}>
                {cat}{count !== undefined ? ` ${count}` : ""}
              </button>
            );
          })}
        </div>

        {/* Safety filter */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#86868b", marginRight: 4 }}>安全:</span>
          {safetyLevels.map((lv) => {
            const active = safety === lv;
            return (
              <button key={lv} onClick={() => { setSafety(lv); setPage(1); }} style={{
                padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                border: "none",
                background: active ? (gradeColor[lv] || "#1d1d1f") : "#f0f0f2",
                color: active ? "#fff" : "#424245",
                fontWeight: active ? 600 : 400,
              }}>
                {lv}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          style={{
            padding: "7px 12px", borderRadius: 8, fontSize: 13, border: "1px solid #e5e5ea",
            background: "#fff", color: "#424245", cursor: "pointer",
          }}
        >
          <option value="relevance">综合排序</option>
          <option value="stars">Stars 最多</option>
          <option value="installs">安装最多</option>
          <option value="safety">安全分最高</option>
          <option value="newest">最新收录</option>
        </select>

        {/* Our skills toggle */}
        <button
          onClick={() => { setOursOnly(!oursOnly); setPage(1); }}
          style={{
            padding: "7px 14px", borderRadius: 980, fontSize: 13, cursor: "pointer",
            border: "none",
            background: oursOnly ? "#ff2d55" : "#f0f0f2",
            color: oursOnly ? "#fff" : "#424245",
            fontWeight: oursOnly ? 600 : 400,
          }}
        >
          官方精选
        </button>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 14, color: "#86868b", marginBottom: 16 }}>
        {loading ? "搜索中..." : `共 ${total.toLocaleString()} 个技能`}
        {query && !loading && ` · 关键词「${query}」`}
      </p>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {skills.map((s) => (
          <Link key={s.id} href={`/skills/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              background: "#fff", borderRadius: 16, padding: "22px 22px 18px",
              boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.04)",
              cursor: "pointer", height: "100%",
              transition: "transform .15s, box-shadow .15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{s.name_zh || s.name}</h3>
                  {s.is_ours && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "#fff0f5", color: "#ff2d55", fontWeight: 500 }}>精选</span>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: gradeColor[s.safety_level] || "#86868b" }}>{s.safety_level}级 {s.safety_score}</span>
              </div>
              <p style={{ fontSize: 14, color: "#86868b", margin: "0 0 12px", lineHeight: 1.5 }}>
                {(s.description_zh || s.description || "").slice(0, 80)}{(s.description_zh || s.description || "").length > 80 ? "..." : ""}
              </p>
              {(s.features?.length > 0) && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {s.features.slice(0, 3).map((f, i) => (
                    <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: "#f5f5f7", color: "#424245" }}>{f}</span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #f0f0f2", fontSize: 13 }}>
                <span style={{ color: "#86868b" }}>
                  {s.category_zh || s.category}
                  {s.github_stars > 0 && ` · ${s.github_stars.toLocaleString()} stars`}
                  {s.author_name && ` · ${s.author_name}`}
                </span>
                <span style={{ color: "#0071e3", fontWeight: 500 }}>详情 →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {!loading && skills.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#86868b" }}>
          <p style={{ fontSize: 18 }}>没有找到匹配的技能</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>试试其他关键词？或者 <Link href="/submit" style={{ color: "#007aff" }}>提交你发现的 Skill</Link></p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e5ea", background: "#fff", cursor: page > 1 ? "pointer" : "default", opacity: page <= 1 ? 0.4 : 1, fontSize: 14 }}
          >
            上一页
          </button>
          <span style={{ padding: "8px 16px", fontSize: 14, color: "#424245" }}>
            第 {page} / {totalPages} 页
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e5ea", background: "#fff", cursor: page < totalPages ? "pointer" : "default", opacity: page >= totalPages ? 0.4 : 1, fontSize: 14 }}
          >
            下一页
          </button>
        </div>
      )}
    </>
  );
}

export default function SkillsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
      <Nav />
      <div style={{ padding: "32px 24px 64px", maxWidth: 1060, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, letterSpacing: -.3 }}>搜索 AI 技能</h1>
        <Suspense><SkillsContent /></Suspense>
      </div>
    </div>
  );
}
