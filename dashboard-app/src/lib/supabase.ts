import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching our database schema
export interface SkillRow {
  id: string;
  slug: string;
  name: string;
  name_zh: string | null;
  description: string | null;
  description_zh: string | null;
  category: string;
  category_zh: string | null;
  subcategory: string | null;
  tags: string[];
  source_platform: string;
  source_url: string | null;
  repo_full_name: string | null;
  author_name: string | null;
  author_github: string | null;
  author_verified: boolean;
  github_stars: number;
  github_forks: number;
  downloads: number;
  install_count: number;
  safety_score: number;
  safety_level: string;
  safety_checks_passed: number;
  safety_checks_total: number;
  safety_last_scan: string | null;
  is_ours: boolean;
  is_featured: boolean;
  is_curated: boolean;
  curated_rank: number;
  install_method: string;
  install_command: string | null;
  platforms: string[];
  min_version: string;
  languages: string[];
  features: string[];
  use_cases: string[];
  trigger_words: string[];
  skill_md_preview: string | null;
  lines: number;
  skill_type: string;
  upstream: string | null;
  last_updated: string;
  created_at: string;
  indexed_at: string;
}

export interface CategoryRow {
  id: number;
  slug: string;
  name: string;
  name_zh: string;
  skill_count: number;
}
