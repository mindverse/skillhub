import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://skillhub.cool";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/skills`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Fetch all skill slugs for individual pages
  const { data: skills } = await supabase
    .from("skills")
    .select("slug,last_updated")
    .order("github_stars", { ascending: false })
    .limit(1000);

  const skillPages: MetadataRoute.Sitemap = (skills || []).map((s) => ({
    url: `${BASE_URL}/skills/${s.slug}`,
    lastModified: s.last_updated ? new Date(s.last_updated) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...skillPages];
}
