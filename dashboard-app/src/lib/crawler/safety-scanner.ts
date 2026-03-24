/**
 * 安全评分 — TypeScript 版（12 项检查）
 * 基于 tools/safety-score.sh 移植
 */

export interface SafetyResult {
  score: number;         // 0-100
  level: string;         // S/A/B/C/D
  checksPassed: number;
  checksTotal: number;
  details: SafetyCheck[];
}

interface SafetyCheck {
  name: string;
  passed: boolean;
  weight: number;
  note: string;
}

// Dangerous patterns to scan for
const DANGEROUS_PATTERNS = [
  /eval\s*\(/i,
  /exec\s*\(/i,
  /child_process/i,
  /require\s*\(\s*['"]child_process['"]\s*\)/,
  /\.exec\s*\(/,
  /rm\s+-rf\s+\//,
  /curl\s+.*\|\s*(bash|sh)/i,
  /wget\s+.*\|\s*(bash|sh)/i,
];

const DATA_COLLECTION_PATTERNS = [
  /fetch\s*\([^)]*(?:analytics|tracking|telemetry)/i,
  /navigator\.sendBeacon/i,
  /process\.env\.(?!GITHUB)/i,  // accessing env vars (except GITHUB_TOKEN for auth)
  /localStorage|sessionStorage/i,
  /document\.cookie/i,
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous|above)\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /disregard\s+(?:all\s+)?(?:previous|prior)/i,
  /forget\s+(?:all\s+)?(?:previous|your)\s+instructions/i,
];

export function scanSafety(
  content: string,
  repoStars: number,
  hasLicense: boolean,
  authorVerified: boolean,
  hasFrontmatter: boolean,
): SafetyResult {
  const checks: SafetyCheck[] = [];

  // 1. No dangerous code execution (15 pts)
  const hasDangerous = DANGEROUS_PATTERNS.some(p => p.test(content));
  checks.push({
    name: "无危险代码执行",
    passed: !hasDangerous,
    weight: 15,
    note: hasDangerous ? "检测到 eval/exec/child_process 等危险模式" : "未检测到危险代码模式",
  });

  // 2. No data collection (10 pts)
  const hasDataCollection = DATA_COLLECTION_PATTERNS.some(p => p.test(content));
  checks.push({
    name: "无数据收集行为",
    passed: !hasDataCollection,
    weight: 10,
    note: hasDataCollection ? "检测到可能的数据收集行为" : "未检测到数据收集行为",
  });

  // 3. No prompt injection (10 pts)
  const hasInjection = PROMPT_INJECTION_PATTERNS.some(p => p.test(content));
  checks.push({
    name: "无提示注入风险",
    passed: !hasInjection,
    weight: 10,
    note: hasInjection ? "检测到可能的提示注入" : "未检测到提示注入",
  });

  // 4. No network requests to unknown hosts (8 pts)
  const unknownNetwork = /https?:\/\/(?!github\.com|api\.github\.com|cdn\.|unpkg\.com|raw\.githubusercontent\.com)\S+/i.test(content);
  checks.push({
    name: "无未知网络请求",
    passed: !unknownNetwork,
    weight: 8,
    note: unknownNetwork ? "检测到外部网络请求" : "无可疑外部网络请求",
  });

  // 5. No file system writes (7 pts)
  const fsWrite = /writeFile|appendFile|fs\.write|mkdirSync|createWriteStream/i.test(content);
  checks.push({
    name: "无文件系统写入",
    passed: !fsWrite,
    weight: 7,
    note: fsWrite ? "检测到文件写入操作" : "无文件写入操作",
  });

  // 6. Has frontmatter (8 pts)
  checks.push({
    name: "有 frontmatter 元数据",
    passed: hasFrontmatter,
    weight: 8,
    note: hasFrontmatter ? "包含标准 frontmatter" : "缺少 frontmatter",
  });

  // 7. Has license (7 pts)
  checks.push({
    name: "有开源许可证",
    passed: hasLicense,
    weight: 7,
    note: hasLicense ? "仓库包含许可证" : "缺少许可证",
  });

  // 8. Source credibility - stars (10 pts)
  const starsPass = repoStars >= 10;
  checks.push({
    name: "源可信度（Stars）",
    passed: starsPass,
    weight: 10,
    note: `仓库 ${repoStars} stars${starsPass ? "（>= 10）" : "（< 10，可信度低）"}`,
  });

  // 9. Author verified (5 pts)
  checks.push({
    name: "作者已验证",
    passed: authorVerified,
    weight: 5,
    note: authorVerified ? "作者已通过验证" : "作者未验证",
  });

  // 10. No base64 encoded content (5 pts)
  const hasBase64 = /[A-Za-z0-9+/]{100,}={0,2}/.test(content);
  checks.push({
    name: "无 Base64 编码内容",
    passed: !hasBase64,
    weight: 5,
    note: hasBase64 ? "检测到 Base64 编码内容" : "无 Base64 编码",
  });

  // 11. Reasonable size (< 50KB) (8 pts)
  const sizeOk = content.length < 50000;
  checks.push({
    name: "文件大小合理",
    passed: sizeOk,
    weight: 8,
    note: sizeOk ? `${(content.length / 1024).toFixed(1)}KB（< 50KB）` : `${(content.length / 1024).toFixed(1)}KB（过大，可能包含异常内容）`,
  });

  // 12. No obfuscated code (7 pts)
  const obfuscated = /\\x[0-9a-f]{2}/gi.test(content) || /\\u[0-9a-f]{4}/gi.test(content) && content.match(/\\u/g)!.length > 10;
  checks.push({
    name: "无混淆代码",
    passed: !obfuscated,
    weight: 7,
    note: obfuscated ? "检测到可能的代码混淆" : "无代码混淆",
  });

  // Calculate score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const passedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);
  const score = Math.round((passedWeight / totalWeight) * 100);
  const checksPassed = checks.filter(c => c.passed).length;

  // Determine level
  let level: string;
  if (score >= 95) level = "S";
  else if (score >= 85) level = "A";
  else if (score >= 70) level = "B";
  else if (score >= 50) level = "C";
  else level = "D";

  return {
    score,
    level,
    checksPassed,
    checksTotal: checks.length,
    details: checks,
  };
}
