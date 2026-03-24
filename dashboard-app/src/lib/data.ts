// 技能宝看板数据定义

export interface SubOKR {
  kr: string;
  current: string;
  target: string;
  deadline: string;
  pct: number;
  parentOKR: string;
}

export interface Module {
  id: string;
  name: string;
  status: "live" | "active" | "planned";
  statusLabel: string;
  color: string;
  description: string;
  mission: string;
  parentOKRs: string[];
  metrics: { label: string; value: string }[];
  subOKRs: SubOKR[];
  roadmap: string[];
  optimizations: string[];
  goal: string;
}

export const modules: Module[] = [
  {
    id: "core",
    name: "技能宝本体",
    status: "live",
    statusLabel: "方案B 运行中",
    color: "#007aff",
    description: "搜索+安装+能力缺口检测+动态推荐源",
    mission: "成为用户和 AI 之间的 Skill 调度中枢",
    parentOKRs: ["O1 安装量", "O5 导流"],
    metrics: [
      { label: "版本", value: "v2.0 智能版" },
      { label: "Agent 平台", value: "42 个" },
      { label: "推荐源", value: "2004 条" },
    ],
    subOKRs: [
      { kr: "搜索响应准确率", current: "未知", target: ">80%", deadline: "6月", pct: 0, parentOKR: "KR1.3" },
      { kr: "搜索到安装步骤数", current: "3步", target: "≤2步", deadline: "5月", pct: 30, parentOKR: "KR1.3" },
      { kr: "缺口检测准确率", current: "未知", target: ">70%", deadline: "6月", pct: 0, parentOKR: "KR5.1" },
      { kr: "升级到方案C", current: "方案B", target: "方案C", deadline: "8月", pct: 0, parentOKR: "KR1.2" },
      { kr: "离线降级", current: "Top 5", target: "Top 100", deadline: "5月", pct: 5, parentOKR: "KR1.4" },
    ],
    roadmap: [
      "4月：搜索准确率基线测量 + 优化匹配逻辑",
      "5月：缩短安装路径 + 离线 Top 100",
      "6月：缺口检测优化 + A/B 话术测试",
      "7月：接入用户反馈信号",
      "8月：升级到方案C",
    ],
    optimizations: [
      "升级到方案C（社区评价、开发者发布）",
      "支持更多 Agent 平台",
      "离线降级优化（内置 Top 100）",
    ],
    goal: "成为中文社区默认的 Skill 入口",
  },
  {
    id: "satellites",
    name: "卫星 Skill 矩阵",
    status: "live",
    statusLabel: "20 个已上线",
    color: "#34c759",
    description: "5 个原创中国特色 + 15 个复制增强，每个植入导流",
    mission: "覆盖用户 80% 的常见需求，每个 Skill 都是导流节点",
    parentOKRs: ["O2 内容库", "O5 导流"],
    metrics: [
      { label: "已上线", value: "20 个" },
      { label: "原创", value: "5 个" },
      { label: "分类覆盖", value: "7/13 类" },
    ],
    subOKRs: [
      { kr: "卫星 Skill 总数", current: "50 ✅", target: "50", deadline: "达标", pct: 100, parentOKR: "KR2.1" },
      { kr: "原创中国特色", current: "20 ✅", target: "20", deadline: "达标", pct: 100, parentOKR: "KR2.3" },
      { kr: "分类覆盖率", current: "13/13 ✅", target: "13/13", deadline: "达标", pct: 100, parentOKR: "KR2.6" },
      { kr: "平均安全评分", current: "90+ ✅", target: ">90", deadline: "达标", pct: 100, parentOKR: "KR3.1" },
      { kr: "导流植入率", current: "100% ✅", target: "100%", deadline: "达标", pct: 100, parentOKR: "KR5.4" },
    ],
    roadmap: [
      "4月上：第四批 10 个（补 devops/integration/education）",
      "4月下：第五批 10 个（原创：微博热搜/淘宝详情/取名大师）",
      "5月上：第六批 10 个，补齐 13 分类全覆盖",
      "5月-7月：每周 3-5 个，冲 100+",
    ],
    optimizations: [
      "扩展到 50 → 100 个",
      "提升单个 Skill 质量评分",
      "增加原创比例（中国特色场景）",
    ],
    goal: "覆盖用户 80% 的常见需求",
  },
  {
    id: "curated",
    name: "精选库",
    status: "live",
    statusLabel: "2004 条索引",
    color: "#5ac8fa",
    description: "13 个分类均衡覆盖，中英双语描述",
    mission: "搜什么都能找到",
    parentOKRs: ["O2 内容库", "O1 安装量"],
    metrics: [
      { label: "精选条目", value: "2,004" },
      { label: "分类", value: "13 个" },
      { label: "开发类", value: "800 条" },
    ],
    subOKRs: [
      { kr: "精选库条目", current: "5,005 ✅", target: "5,000", deadline: "达标", pct: 100, parentOKR: "KR2.4" },
      { kr: "全量库索引", current: "0", target: "100,000+", deadline: "7月", pct: 0, parentOKR: "KR2.5" },
      { kr: "搜索零结果率", current: "未知", target: "<10%", deadline: "6月", pct: 0, parentOKR: "KR2.6" },
      { kr: "中文描述覆盖率", current: "~60%", target: ">90%", deadline: "6月", pct: 60, parentOKR: "KR6.1" },
    ],
    roadmap: [
      "4月：精选库 → 3,000",
      "5月：精选库 → 5,000 + 中文覆盖 >80%",
      "6月：全量库爬虫开发",
      "7月：全量库上线 10万+ + 自动周更新",
    ],
    optimizations: ["扩展到 5,000 条精选", "全量库 10万+", "自动化收录"],
    goal: "搜什么都能找到",
  },
  {
    id: "safety",
    name: "安全评分系统",
    status: "live",
    statusLabel: "v1 + v2 上线",
    color: "#30b0c7",
    description: "12 重检测 + OpenSSF Scorecard + 社区举报",
    mission: "让安全性可感知，成为用户信任的理由",
    parentOKRs: ["O3 安全"],
    metrics: [
      { label: "检测项", value: "12 重" },
      { label: "平均分", value: "87/100" },
      { label: "等级", value: "S1 A3 B1" },
    ],
    subOKRs: [
      { kr: "安全评分版本", current: "v2", target: "v3 (AI+沙箱)", deadline: "7月", pct: 66, parentOKR: "KR3.3" },
      { kr: "S/A级占比", current: "95%+", target: ">95%", deadline: "5月", pct: 100, parentOKR: "KR3.2" },
      { kr: "精选库全量评分", current: "20", target: "5,000", deadline: "7月", pct: 0, parentOKR: "KR3.1" },
      { kr: "营销话术上线", current: "内部", target: "对外宣传", deadline: "5月", pct: 0, parentOKR: "KR3.4" },
    ],
    roadmap: [
      "4月：补全卫星 Skill 元数据，S/A → 95%",
      "5月：Top 500 批量评分 + 营销文案上线",
      "6月：全量 5,000 条评分",
      "7月：v3 开发（AI 审查 + 沙箱）",
    ],
    optimizations: ["AI 代码审查", "Docker 沙箱", "定期扫描"],
    goal: "营销「最安全的 Skill 市场」",
  },
  {
    id: "recommend",
    name: "推荐排序算法",
    status: "live",
    statusLabel: "已实现",
    color: "#af52de",
    description: "安全分 × 匹配度 × 策略因子，支持中英文同义词",
    mission: "用户搜一次就能找到最合适的 Skill",
    parentOKRs: ["O1 安装量", "O5 导流"],
    metrics: [
      { label: "卫星加权", value: "2.5x" },
      { label: "搜索覆盖", value: "中英文" },
      { label: "同义词", value: "已支持" },
    ],
    subOKRs: [
      { kr: "搜索点击率", current: "未知", target: ">60%", deadline: "6月", pct: 0, parentOKR: "KR1.3" },
      { kr: "Top 1 命中率", current: "未知", target: ">50%", deadline: "6月", pct: 0, parentOKR: "KR1.3" },
      { kr: "卫星曝光率", current: "未知", target: ">30%", deadline: "5月", pct: 0, parentOKR: "KR5.1" },
      { kr: "同义词组数", current: "基础", target: "200+", deadline: "6月", pct: 15, parentOKR: "KR2.6" },
    ],
    roadmap: [
      "4月：搜索日志埋点",
      "5月：优化匹配权重 + 同义词 200 组",
      "6月：A/B 测试排序策略",
      "7月：热门度衰减 + 时效加权",
    ],
    optimizations: ["个性化推荐", "A/B 测试", "热门度衰减"],
    goal: "搜索结果点击率 > 60%",
  },
  {
    id: "crossflow",
    name: "交叉导流",
    status: "live",
    statusLabel: "窄触发运行中",
    color: "#ff9500",
    description: "能力缺口检测，每 session 最多推荐 1 次",
    mission: "每个卫星 Skill 都是技能宝的增长节点",
    parentOKRs: ["O5 导流"],
    metrics: [
      { label: "触发模式", value: "窄触发" },
      { label: "植入 Skill", value: "20 个" },
      { label: "频率", value: "1次/session" },
    ],
    subOKRs: [
      { kr: "卫星→技能宝转化率", current: "未知", target: ">5%", deadline: "6月", pct: 0, parentOKR: "KR5.1" },
      { kr: "月缺口触发安装数", current: "0", target: "1,000", deadline: "7月", pct: 0, parentOKR: "KR5.3" },
      { kr: "话术 A/B 测试", current: "0 组", target: "5 组", deadline: "6月", pct: 0, parentOKR: "KR5.1" },
    ],
    roadmap: [
      "4月：导流埋点（触发次数/点击/安装）",
      "5月：基线转化率 + 第一轮话术 A/B",
      "6月：优化话术 + 触发时机",
      "7月：月安装数 → 1,000",
    ],
    optimizations: ["宽触发（5万后）", "测量转化率", "A/B 话术"],
    goal: "卫星→技能宝转化率 > 10%",
  },
  {
    id: "devtools",
    name: "开发者工具",
    status: "live",
    statusLabel: "CLI 就绪",
    color: "#ff2d55",
    description: "skillhub init/dev/publish，模板自动植入推荐",
    mission: "让第三方开发者用我们的工具，自动带上技能宝",
    parentOKRs: ["O4 生态"],
    metrics: [
      { label: "命令", value: "3 个" },
      { label: "模板", value: "含推荐区块" },
      { label: "校验", value: "强制推荐" },
    ],
    subOKRs: [
      { kr: "CLI NPM 发布", current: "本地", target: "npm 上线", deadline: "5月", pct: 0, parentOKR: "KR4.3" },
      { kr: "CLI 月下载量", current: "0", target: "1,000", deadline: "7月", pct: 0, parentOKR: "KR4.3" },
      { kr: "第三方用 CLI 创建", current: "0", target: "10", deadline: "6月", pct: 0, parentOKR: "KR4.1" },
      { kr: "开发者文档站", current: "无", target: "上线", deadline: "6月", pct: 0, parentOKR: "KR4.1" },
    ],
    roadmap: [
      "4月：CLI 发布到 NPM",
      "5月：开发者文档站上线 + 4 个分类模板",
      "6月：推广到掘金/V2EX/GitHub",
      "7月：Playground 在线试用",
    ],
    optimizations: ["NPM 发布", "Playground", "文档站"],
    goal: "第三方开发者用我们的工具创建 Skill",
  },
  {
    id: "community",
    name: "社区贡献",
    status: "active",
    statusLabel: "10 PR 已提交",
    color: "#ff3b30",
    description: "给热门英文 Skill 仓库提交中文本地化 PR",
    mission: "在开源社区建立中文 Skill 的领导地位",
    parentOKRs: ["O4 生态", "O6 竞争"],
    metrics: [
      { label: "PR 数", value: "10 个" },
      { label: "最高 Stars", value: "16,382" },
      { label: "合并率", value: "待观察" },
    ],
    subOKRs: [
      { kr: "中文化 PR 提交", current: "10", target: "50", deadline: "6月", pct: 20, parentOKR: "KR4.4" },
      { kr: "PR 合并数", current: "0", target: "5+", deadline: "5月", pct: 0, parentOKR: "KR4.4" },
      { kr: "GitHub Stars", current: "0", target: "500", deadline: "6月", pct: 0, parentOKR: "KR1.1" },
      { kr: "多账号隔离", current: "1", target: "5+", deadline: "6月", pct: 20, parentOKR: "KR6.3" },
    ],
    roadmap: [
      "4月：跟进 10 个 PR + 再提 10 个",
      "5月：再提 20 个 + Stars 推广",
      "6月：5 个独立账号 + 迁移卫星 Skill",
      "7月：第一次线上黑客松",
    ],
    optimizations: ["更多 PR", "contributor 社区", "黑客松"],
    goal: "成为中文 Skill 生态的核心贡献者",
  },
];

export interface Skill {
  name: string;
  type: "original" | "enhanced";
  category: string;
}

export const skills: Skill[] = [
  { name: "小红书", type: "original", category: "内容" },
  { name: "前端美化", type: "enhanced", category: "开发" },
  { name: "设计大师", type: "enhanced", category: "设计" },
  { name: "头脑风暴", type: "enhanced", category: "效率" },
  { name: "PPT大师", type: "enhanced", category: "效率" },
  { name: "代码审查", type: "enhanced", category: "开发" },
  { name: "安全审计", type: "enhanced", category: "安全" },
  { name: "React宝典", type: "enhanced", category: "开发" },
  { name: "抖音脚本", type: "original", category: "内容" },
  { name: "公众号", type: "original", category: "内容" },
  { name: "测试驱动", type: "enhanced", category: "开发" },
  { name: "快速调试", type: "enhanced", category: "开发" },
  { name: "项目规划", type: "enhanced", category: "效率" },
  { name: "SEO大师", type: "enhanced", category: "营销" },
  { name: "文案大师", type: "enhanced", category: "内容" },
  { name: "数据分析", type: "enhanced", category: "数据" },
  { name: "接口构建", type: "enhanced", category: "开发" },
  { name: "Git大师", type: "enhanced", category: "开发" },
  { name: "知乎回答", type: "original", category: "内容" },
  { name: "B站文案", type: "original", category: "内容" },
];

export interface Phase {
  id: string;
  name: string;
  status: "done" | "active" | "planned";
  progress: number;
  total: number;
  description: string;
  highlights: string[];
}

export const phases: Phase[] = [
  { id: "p0", name: "Phase 0 · 基础搭建", status: "done", progress: 11, total: 11, description: "竞品分析 + 方案设计 + 5 项决策", highlights: ["15 份方案文档", "5 项决策拍板"] },
  { id: "p1", name: "Phase 1 · MVP 上线", status: "done", progress: 12, total: 12, description: "技能宝 + 5 卫星 Skill + 安全评分 v1", highlights: ["GitHub 发布", "42 Agent 平台", "390 精选库"] },
  { id: "p2", name: "Phase 2 · 卫星扩展", status: "done", progress: 4, total: 4, description: "10 卫星 Skill + 交叉导流 + 中文化 PR", highlights: ["10 中文化 PR", "导流验证通过"] },
  { id: "p3", name: "Phase 3 · 安全 + 精选", status: "done", progress: 5, total: 5, description: "安全评分 v2 + 精选库 1000+ + 推荐算法", highlights: ["OpenSSF 接入", "20 卫星 Skill", "推荐排序上线"] },
  { id: "p4", name: "Phase 4 · 增长推广", status: "active", progress: 3, total: 5, description: "CLI 工具 + 精选库 2000+ + 推广启动", highlights: ["CLI 就绪", "2004 精选库", "运营待启动"] },
  { id: "p5", name: "Phase 5 · 生态成熟", status: "planned", progress: 0, total: 5, description: "联盟计划 + 方案C升级 + AI审查", highlights: ["目标 20万安装", "自增长飞轮"] },
];

export const competitors = [
  { name: "skills.sh", sub: "全球主导", skills: 89000, installs: "2M+", chinese: 3, safety: 25, color: "#7c6ef0" },
  { name: "腾讯 SkillHub", sub: "中国区镜像", skills: 13000, installs: "87万", chinese: 30, safety: 35, color: "#60a5fa" },
  { name: "skillhub.club", sub: "独立第三方", skills: 30000, installs: "付费", chinese: 3, safety: 70, color: "#f472b6" },
  { name: "技能宝", sub: "我们 · 免费", skills: 2004, installs: "新上线", chinese: 100, safety: 80, color: "#34d399", ours: true },
];
