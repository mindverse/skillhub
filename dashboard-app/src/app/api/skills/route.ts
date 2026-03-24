import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // 1 min cache

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category") || null;
  const safety = searchParams.get("safety") || null; // "S,A"
  const sort = searchParams.get("sort") || "relevance";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20")));
  const ours = searchParams.get("ours"); // "true" to filter our skills only

  let query = supabase.from("skills").select("*", { count: "exact" });

  // Text search
  if (q) {
    query = query.or(
      `name.ilike.%${q}%,name_zh.ilike.%${q}%,slug.ilike.%${q}%,description.ilike.%${q}%,description_zh.ilike.%${q}%,tags.cs.{${q}}`
    );
  }

  // Category filter
  if (category) {
    query = query.or(`category.eq.${category},category_zh.eq.${category}`);
  }

  // Safety filter
  if (safety) {
    const levels = safety.split(",").map((s) => s.trim());
    query = query.in("safety_level", levels);
  }

  // Our skills only
  if (ours === "true") {
    query = query.eq("is_ours", true);
  }

  // Sorting
  switch (sort) {
    case "stars":
      query = query.order("github_stars", { ascending: false });
      break;
    case "installs":
      query = query.order("install_count", { ascending: false });
      break;
    case "safety":
      query = query.order("safety_score", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      // relevance: featured first, then ours, then by stars
      if (q) {
        query = query
          .order("is_featured", { ascending: false })
          .order("is_ours", { ascending: false })
          .order("github_stars", { ascending: false });
      } else {
        query = query
          .order("is_featured", { ascending: false })
          .order("is_ours", { ascending: false })
          .order("github_stars", { ascending: false });
      }
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    skills: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  });
}
