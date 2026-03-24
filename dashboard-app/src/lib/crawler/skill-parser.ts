/**
 * SKILL.md 解析器 — 提取 frontmatter 和内容摘要
 */

export interface ParsedSkill {
  name: string;
  description: string;
  version: string;
  userInvocable: boolean;
  license: string | null;
  contentPreview: string;
  lineCount: number;
}

export function parseSkillMd(content: string): ParsedSkill | null {
  if (!content || !content.includes("---")) return null;

  const lines = content.split("\n");
  let inFrontmatter = false;
  let frontmatterEnd = -1;
  const frontmatterLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
    if (inFrontmatter) {
      frontmatterLines.push(lines[i]);
    }
  }

  if (frontmatterEnd === -1) return null;

  // Parse YAML-like frontmatter (simple key: value)
  const meta: Record<string, string> = {};
  let currentKey = "";
  let currentValue = "";

  for (const line of frontmatterLines) {
    const match = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (match) {
      if (currentKey) meta[currentKey] = currentValue.trim();
      currentKey = match[1];
      currentValue = match[2].replace(/^["']|["']$/g, "");
    } else if (currentKey && (line.startsWith("  ") || line.startsWith("\t"))) {
      currentValue += " " + line.trim();
    }
  }
  if (currentKey) meta[currentKey] = currentValue.trim();

  if (!meta.name && !meta.description) return null;

  // Extract content preview (first 500 chars after frontmatter)
  const bodyLines = lines.slice(frontmatterEnd + 1);
  const body = bodyLines.join("\n").trim();
  const contentPreview = body.slice(0, 500);

  return {
    name: meta.name || "",
    description: meta.description || "",
    version: meta.version || "0.0.0",
    userInvocable: meta["user-invocable"] === "true",
    license: meta.license || null,
    contentPreview,
    lineCount: lines.length,
  };
}
