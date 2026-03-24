-- SkillHub 搜索引擎 — Supabase Schema
-- 在 Supabase SQL Editor 中运行此文件

-- 1. 分类表
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,        -- English
  name_zh TEXT NOT NULL,     -- Chinese
  skill_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO categories (slug, name, name_zh) VALUES
  ('development', 'Development', '开发工具'),
  ('content', 'Content Creation', '内容创作'),
  ('design', 'Design', '设计'),
  ('productivity', 'Productivity', '效率工具'),
  ('security', 'Security', '安全'),
  ('marketing', 'Marketing', '营销'),
  ('data', 'Data', '数据'),
  ('devops', 'DevOps', '运维'),
  ('education', 'Education', '教育'),
  ('integration', 'Integration', '集成'),
  ('multimedia', 'Multimedia', '多媒体'),
  ('business', 'Business', '商业'),
  ('workflow', 'Workflow', '工作流');

-- 2. 核心 skills 表
CREATE TABLE skills (
  id TEXT PRIMARY KEY,             -- e.g. "gh_anthropics_code-review"
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_zh TEXT,
  description TEXT,
  description_zh TEXT,
  category TEXT NOT NULL,          -- EN slug
  category_zh TEXT,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Source
  source_platform TEXT DEFAULT 'github',   -- official/github/community/skillhub
  source_url TEXT,
  repo_full_name TEXT,

  -- Author
  author_name TEXT,
  author_github TEXT,
  author_verified BOOLEAN DEFAULT false,

  -- Stats
  github_stars INT DEFAULT 0,
  github_forks INT DEFAULT 0,
  downloads INT DEFAULT 0,
  install_count INT DEFAULT 0,

  -- Safety
  safety_score INT DEFAULT 0,
  safety_level TEXT DEFAULT 'C',   -- S/A/B/C/D
  safety_checks_passed INT DEFAULT 0,
  safety_checks_total INT DEFAULT 12,
  safety_last_scan TIMESTAMPTZ,

  -- Flags
  is_ours BOOLEAN DEFAULT false,       -- 我们自研的 100 个
  is_featured BOOLEAN DEFAULT false,
  is_curated BOOLEAN DEFAULT false,
  curated_rank INT DEFAULT 0,

  -- Install
  install_method TEXT DEFAULT 'skills-cli',
  install_command TEXT,

  -- Compatibility
  platforms TEXT[] DEFAULT '{claude-code}',
  min_version TEXT DEFAULT '1.0.0',
  languages TEXT[] DEFAULT '{}',

  -- Content (for our own skills)
  features TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  trigger_words TEXT[] DEFAULT '{}',
  skill_md_preview TEXT,
  lines INT DEFAULT 0,
  skill_type TEXT DEFAULT 'community',  -- original/enhanced/community
  upstream TEXT,

  -- Timestamps
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  indexed_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 提交队列
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  repo_full_name TEXT NOT NULL,
  submitted_by TEXT,
  status TEXT DEFAULT 'pending',    -- pending/approved/rejected
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- 4. 索引
CREATE INDEX idx_skills_slug ON skills(slug);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_safety_level ON skills(safety_level);
CREATE INDEX idx_skills_is_ours ON skills(is_ours);
CREATE INDEX idx_skills_is_featured ON skills(is_featured);
CREATE INDEX idx_skills_install_count ON skills(install_count DESC);
CREATE INDEX idx_skills_github_stars ON skills(github_stars DESC);
CREATE INDEX idx_skills_safety_score ON skills(safety_score DESC);
CREATE INDEX idx_skills_created_at ON skills(created_at DESC);

-- 5. 全文搜索（中英文混合）
-- 使用 pg_trgm 做模糊匹配（对中文友好）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_skills_name_trgm ON skills USING gin (name gin_trgm_ops);
CREATE INDEX idx_skills_name_zh_trgm ON skills USING gin (name_zh gin_trgm_ops);
CREATE INDEX idx_skills_description_trgm ON skills USING gin (description gin_trgm_ops);
CREATE INDEX idx_skills_description_zh_trgm ON skills USING gin (description_zh gin_trgm_ops);

-- 6. 搜索函数
CREATE OR REPLACE FUNCTION search_skills(
  search_query TEXT DEFAULT NULL,
  filter_category TEXT DEFAULT NULL,
  filter_safety TEXT[] DEFAULT NULL,
  sort_by TEXT DEFAULT 'relevance',
  page_num INT DEFAULT 1,
  page_size INT DEFAULT 20
)
RETURNS TABLE (
  skill skills,
  total_count BIGINT
) AS $$
DECLARE
  offset_val INT := (page_num - 1) * page_size;
BEGIN
  RETURN QUERY
  WITH filtered AS (
    SELECT s.*,
      CASE
        WHEN search_query IS NULL OR search_query = '' THEN 0
        ELSE (
          CASE WHEN s.name ILIKE '%' || search_query || '%' THEN 10 ELSE 0 END +
          CASE WHEN s.name_zh ILIKE '%' || search_query || '%' THEN 10 ELSE 0 END +
          CASE WHEN s.slug ILIKE '%' || search_query || '%' THEN 8 ELSE 0 END +
          CASE WHEN s.description ILIKE '%' || search_query || '%' THEN 3 ELSE 0 END +
          CASE WHEN s.description_zh ILIKE '%' || search_query || '%' THEN 3 ELSE 0 END +
          CASE WHEN search_query = ANY(s.tags) THEN 5 ELSE 0 END +
          CASE WHEN s.is_ours THEN 2 ELSE 0 END +
          CASE WHEN s.is_featured THEN 1 ELSE 0 END
        )
      END AS relevance_score
    FROM skills s
    WHERE
      (search_query IS NULL OR search_query = '' OR
        s.name ILIKE '%' || search_query || '%' OR
        s.name_zh ILIKE '%' || search_query || '%' OR
        s.slug ILIKE '%' || search_query || '%' OR
        s.description ILIKE '%' || search_query || '%' OR
        s.description_zh ILIKE '%' || search_query || '%' OR
        search_query = ANY(s.tags) OR
        EXISTS (SELECT 1 FROM unnest(s.trigger_words) tw WHERE tw ILIKE '%' || search_query || '%')
      )
      AND (filter_category IS NULL OR s.category = filter_category OR s.category_zh = filter_category)
      AND (filter_safety IS NULL OR s.safety_level = ANY(filter_safety))
  ),
  counted AS (
    SELECT count(*) AS cnt FROM filtered
  )
  SELECT f::skills, c.cnt
  FROM filtered f, counted c
  ORDER BY
    CASE sort_by
      WHEN 'relevance' THEN f.relevance_score
      WHEN 'stars' THEN f.github_stars
      WHEN 'installs' THEN f.install_count
      WHEN 'safety' THEN f.safety_score
      WHEN 'newest' THEN EXTRACT(EPOCH FROM f.created_at)::INT
      ELSE f.relevance_score
    END DESC,
    f.is_featured DESC,
    f.is_ours DESC,
    f.github_stars DESC
  LIMIT page_size OFFSET offset_val;
END;
$$ LANGUAGE plpgsql;

-- 7. 分类计数更新函数
CREATE OR REPLACE FUNCTION update_category_counts()
RETURNS void AS $$
BEGIN
  UPDATE categories c
  SET skill_count = (
    SELECT count(*) FROM skills s WHERE s.category = c.slug
  );
END;
$$ LANGUAGE plpgsql;

-- 8. RLS (Row Level Security) — 公开读
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are publicly readable" ON skills FOR SELECT USING (true);
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (true);

-- submissions 只允许 insert，不允许 read（保护提交者信息）
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON submissions FOR INSERT WITH CHECK (true);
