import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 300; // 5 min cache

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  // Also fetch related skills (same category, max 4)
  const { data: related } = await supabase
    .from("skills")
    .select("slug,name,name_zh,description_zh,category_zh,safety_score,safety_level,github_stars,is_ours,install_command")
    .eq("category", data.category)
    .neq("slug", slug)
    .order("is_ours", { ascending: false })
    .order("github_stars", { ascending: false })
    .limit(4);

  return NextResponse.json({
    skill: data,
    related: related || [],
  });
}
