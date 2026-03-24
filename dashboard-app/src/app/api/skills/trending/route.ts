import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const by = searchParams.get("by") || "stars"; // stars | installs | safety
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

  let query = supabase
    .from("skills")
    .select("slug,name,name_zh,description_zh,category,category_zh,safety_score,safety_level,github_stars,install_count,is_ours,is_featured,install_command,author_name,author_github,repo_full_name");

  switch (by) {
    case "installs":
      query = query.order("install_count", { ascending: false });
      break;
    case "safety":
      query = query.order("safety_score", { ascending: false });
      break;
    default:
      query = query.order("github_stars", { ascending: false });
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ skills: data || [], by, limit });
}
