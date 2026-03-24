import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { repo_full_name, submitted_by, notes } = body;

  if (!repo_full_name || typeof repo_full_name !== "string") {
    return NextResponse.json(
      { error: "repo_full_name is required (e.g. 'owner/repo')" },
      { status: 400 }
    );
  }

  // Basic format check
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo_full_name)) {
    return NextResponse.json(
      { error: "Invalid repo format. Use 'owner/repo'" },
      { status: 400 }
    );
  }

  // Check for duplicate pending submission
  const { data: existing } = await supabase
    .from("submissions")
    .select("id")
    .eq("repo_full_name", repo_full_name)
    .eq("status", "pending")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { message: "This repo already has a pending submission", id: existing[0].id },
      { status: 200 }
    );
  }

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      repo_full_name,
      submitted_by: submitted_by || null,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Submission received! We'll review it shortly.",
    id: data.id,
  }, { status: 201 });
}
