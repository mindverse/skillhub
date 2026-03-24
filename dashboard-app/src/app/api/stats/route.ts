import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 300; // 5 min

export async function GET() {
  const [
    { count: totalSkills },
    { count: oursCount },
    { count: featuredCount },
    { data: categories },
    { data: safetyDist },
    { data: topCategories },
  ] = await Promise.all([
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }).eq("is_ours", true),
    supabase.from("skills").select("*", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("categories").select("name_zh,skill_count").order("skill_count", { ascending: false }),
    supabase.from("skills").select("safety_level"),
    supabase.from("categories").select("name_zh,skill_count").order("skill_count", { ascending: false }).limit(5),
  ]);

  // Calculate safety distribution
  const safetyDistribution: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  if (safetyDist) {
    for (const row of safetyDist) {
      const level = row.safety_level;
      if (level in safetyDistribution) safetyDistribution[level]++;
    }
  }

  return NextResponse.json({
    totalSkills: totalSkills || 0,
    ourSkills: oursCount || 0,
    featuredSkills: featuredCount || 0,
    totalCategories: categories?.length || 0,
    safetyDistribution,
    topCategories: topCategories || [],
  });
}
