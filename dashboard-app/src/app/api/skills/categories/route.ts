import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // 1 hour cache

export async function GET() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("skill_count", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: data || [] });
}
