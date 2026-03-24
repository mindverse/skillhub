# 热门 Skill 复制清单

> 制定时间：2026-03-18
> 数据来源：GitHub、skills.sh、各 awesome-claude-skills 仓库
> 安装量数据截至 2026 年 3 月

---

## 优先级说明

- **高**：安装量大 / 中国用户刚需 / 导流价值高，本周启动
- **中**：有价值但非紧急，两周内启动
- **低**：长尾需求，按需启动

## 复制难度说明

- **简单**：单文件 SKILL.md，直接翻译即可
- **中等**：包含多文件/模板/脚本，需适配
- **复杂**：依赖外部服务/API，需额外集成

## 复制方式说明

- **完全复制**：复制并中文化，独立发布维护
- **Contributor**：以贡献者身份提交中文翻译 PR
- **原创替代**：不复制，从零开发中文原创版本

---

## 第一梯队：高优先级（P0，立即启动）

| # | Skill 名称 | 来源 / GitHub | 安装量/Stars | 功能描述 | 中文名建议 | 复制难度 | 复制方式 |
|---|-----------|--------------|-------------|---------|-----------|---------|---------|
| 1 | find-skills | vercel-labs | 41.8 万安装 | 元技能：搜索和发现其他 Skill，一键安装。是整个 Skill 生态的入口 | 技能搜索 | 中等 | 原创替代（技能宝本身就是这个功能的升级版） |
| 2 | frontend-design | [anthropics/claude-code](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) | 12.4-27.7 万安装 | Anthropic 官方出品。指导 Claude 生成高品质前端 UI，避免"AI 味"审美，50 种视觉风格 | 前端美化 | 简单 | 完全复制 |
| 3 | web-design-guidelines | vercel-labs | 13.7 万安装 | Vercel 官方设计规范。确保无障碍合规，设计系统最佳实践 | 设计大师 | 简单 | 完全复制 |
| 4 | vercel-react-best-practices | vercel-labs | 17.6 万安装 | Vercel 官方 React 开发最佳实践，涵盖组件设计、状态管理、性能优化 | React 宝典 | 简单 | 完全复制 |
| 5 | remotion-best-practices | remotion-dev | 12.6 万安装 | Remotion 官方出品。React 编程式视频创建，动画/音频/字幕/3D | 动效大师 | 中等 | 完全复制 |
| 6 | brainstorming / superpowers | [obra/superpowers](https://github.com/wln/obra-superpowers) | 高 Stars | 结构化创意讨论框架。像资深工程师主持设计评审，提问-方案-推荐 | 头脑风暴 | 简单 | 完全复制 |
| 7 | owasp-security | [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp) | 高 Stars | OWASP Top 10:2025 + ASVS 5.0 + AI 安全。20+ 语言安全检查 | 安全审计 | 中等 | 完全复制 |
| 8 | code-review | 多个仓库 | 高需求 | 系统化代码审查，PR 决策和 git 历史清理 | 代码审查 | 简单 | 完全复制 |
| 9 | revealjs-skill | [ryanbbrown/revealjs-skill](https://github.com/ryanbbrown/revealjs-skill) | 中等 Stars | 从描述生成 Reveal.js 演示文稿，支持自定义 CSS 和图表 | PPT 大师 | 简单 | 完全复制 |
| 10 | xhs-writer | 社区 | 5.5 万安装（对标） | 小红书爆文生成（原版较弱，需大幅优化） | 小红书 | 简单 | 原创替代 |

---

## 第二梯队：高优先级（P1，本周内启动）

| # | Skill 名称 | 来源 / GitHub | 安装量/Stars | 功能描述 | 中文名建议 | 复制难度 | 复制方式 |
|---|-----------|--------------|-------------|---------|-----------|---------|---------|
| 11 | tdd | [zscott/tdd](https://github.com/travisvn/awesome-claude-skills) | 高评分 | 测试驱动开发。红-绿-重构循环，集成 git 工作流和 PR 创建 | 测试驱动 | 简单 | 完全复制 |
| 12 | systematic-debugging | obra/superpowers | 高评分 | 遇到 bug/测试失败时自动加载，系统化排错流程 | 快速调试 | 简单 | 完全复制 |
| 13 | planning-with-files | 社区 | 最高 Stars 之一 | 基于文件的多会话项目规划，任务拆解和追踪 | 项目规划 | 简单 | 完全复制 |
| 14 | pdf (document-skills) | [anthropics/skills](https://github.com/anthropics/skills) | 官方内置 | 官方文档技能。PDF 解析、表格提取、合并拆分、标注 | PDF 工具 | 中等 | Contributor |
| 15 | seo-analysis | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | 13 子技能 | 全站 SEO 审计。技术 SEO、E-E-A-T、Schema、GEO/AEO | SEO 大师 | 复杂 | 完全复制 |
| 16 | copywriting | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 中等 Stars | 专业营销文案。CRO、A/B 测试、转化优化 | 文案大师 | 简单 | 完全复制 |
| 17 | marketing-strategy | [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 5200+ Stars | 192 个技能中的营销策略模块。PMM、增长黑客、GTM 策略 | 营销策划 | 中等 | 完全复制 |
| 18 | claude-mem | 社区 | 中等需求 | 跨会话长期记忆。保持用户偏好和上下文 | 记忆增强 | 中等 | 完全复制 |
| 19 | using-git-worktrees | obra/superpowers | 高评分 | Git worktree 隔离开发。安全并行开发多个功能 | 分支管理 | 简单 | 完全复制 |
| 20 | secrets-scanner | 社区 | 安全刚需 | 扫描硬编码密钥、API Key、凭证、PII 信息 | 密钥扫描 | 简单 | 完全复制 |

---

## 第三梯队：中优先级（P2，两周内启动）

| # | Skill 名称 | 来源 / GitHub | 安装量/Stars | 功能描述 | 中文名建议 | 复制难度 | 复制方式 |
|---|-----------|--------------|-------------|---------|-----------|---------|---------|
| 21 | nextjs-patterns | 社区 | 中等 | Next.js App Router、Server Components、中间件最佳实践 | Next 宝典 | 简单 | 完全复制 |
| 22 | typescript-strict | 社区 | 中等 | 严格 TypeScript：泛型、区分联合类型、品牌类型 | TS 严格 | 简单 | 完全复制 |
| 23 | web-artifacts-builder | 社区 | 中等 Stars | React + Tailwind + shadcn/ui 构建精美 HTML 组件 | 组件工坊 | 中等 | 完全复制 |
| 24 | csv-data-summarizer | 社区 | 中等 | CSV 自动分析：列分布、缺失值、相关性、可视化 | 数据分析 | 简单 | 完全复制 |
| 25 | figma-to-code | [scoobynko/claude-code-design-skills](https://github.com/scoobynko/claude-code-design-skills) | 中等 Stars | Figma 设计稿转 React/Next.js 生产代码 | 设计转码 | 复杂 | Contributor |
| 26 | shannon | 社区 | 安全领域 | 自动化渗透测试。96% 漏洞发现率，50+ 漏洞类型 | 渗透测试 | 复杂 | Contributor |
| 27 | i18n-expert | [daymade/claude-code-skills](https://github.com/daymade/claude-code-skills) | 中等 | 国际化设置。替换硬编码字符串、配置 i18n 框架 | 国际化 | 简单 | 完全复制 |
| 28 | email-sequence | [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 5200+ Stars | 营销邮件序列。自动化 EDM、触发邮件、A/B 测试 | 邮件营销 | 简单 | 完全复制 |
| 29 | social-media-analyzer | [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 5200+ Stars | 社交媒体数据分析和竞品追踪 | 社媒分析 | 中等 | 完全复制 |
| 30 | mcp-builder | 社区 | 中等 | 创建高质量 MCP 服务器，集成外部 API | 接口构建 | 复杂 | Contributor |

---

## 第四梯队：低优先级 / 原创（P3，按需启动）

| # | Skill 名称 | 来源 / GitHub | 安装量/Stars | 功能描述 | 中文名建议 | 复制难度 | 复制方式 |
|---|-----------|--------------|-------------|---------|-----------|---------|---------|
| 31 | data-pipeline | 社区 | 中等 | pandas/Polars 数据管道搭建和 ETL 流程 | 数据管道 | 中等 | 完全复制 |
| 32 | node-service | 社区 | 中等 | Node.js 服务脚手架。Express/Fastify、中间件、优雅关闭 | 服务搭建 | 简单 | 完全复制 |
| 33 | async-patterns | 社区 | 中等 | Python 异步模式。asyncio、aiohttp、任务组 | 异步编程 | 简单 | 完全复制 |
| 34 | react-component-generator | 社区 | 中等 | React 组件脚手架。TS + 测试 + Stories + 文件结构 | 组件生成 | 简单 | 完全复制 |
| 35 | page-cro | [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 5200+ Stars | 页面转化率优化。CRO 分析和 A/B 测试 | 转化优化 | 简单 | 完全复制 |
| 36 | content-research-writer | 社区 | 中等 | 深度内容调研和 SEO 长文撰写 | 内容创作 | 简单 | 完全复制 |
| 37 | csp-generator | 社区 | 安全领域 | CSP 头生成。nonce、hash 配置 | 安全策略 | 简单 | 完全复制 |
| 38 | supabase-developer | [supabase/agent-skills](https://github.com/supabase/agent-skills) | 官方出品 | Supabase 全栈：数据库/认证/存储/Edge Functions | 数据库助手 | 复杂 | Contributor |
| 39 | obsidian-skills | 官方 CEO 出品 | 高 Stars | Obsidian 笔记管理。自动标签、链接、摘要 | 笔记管理 | 中等 | Contributor |
| 40 | seomachine | [TheCraigHewitt/seomachine](https://github.com/TheCraigHewitt/seomachine) | 中等 | SEO 长文内容生产线。调研-写作-分析-优化 | 爆文工厂 | 中等 | 完全复制 |

---

## 原创中文 Skill（无对标，自研）

| # | Skill 名 | 中文名 | 功能描述 | 优先级 | 复制难度 |
|---|---------|--------|---------|--------|---------|
| 41 | xhs-master | 小红书 | 小红书爆文生成。种草文案、标题优化、标签推荐、配图建议 | 高 | 简单 |
| 42 | douyin-script | 抖音脚本 | 抖音短视频脚本。分镜头、文案、BGM 建议、封面标题 | 高 | 简单 |
| 43 | wechat-article | 公众号 | 微信公众号文章。排版、标题党、引导关注、摘要 | 高 | 简单 |
| 44 | feishu-helper | 飞书助手 | 飞书文档/表格/多维表格/机器人集成 | 中 | 中等 |
| 45 | zhihu-answer | 知乎回答 | 知乎高赞回答和专栏文章。专业、有深度、有故事感 | 中 | 简单 |
| 46 | bilibili-script | B站文案 | B站视频标题、简介、分P 标题、弹幕互动引导 | 中 | 简单 |
| 47 | taobao-detail | 淘宝详情 | 淘宝/天猫商品详情页文案、卖点提炼、买家秀引导 | 中 | 简单 |
| 48 | weibo-hot | 微博热搜 | 微博热点追踪和文案、话题策划 | 低 | 简单 |
| 49 | chinese-copywriting | 中文文案 | 中文文案通用规范。标点、排版、语气、平台适配 | 中 | 简单 |
| 50 | chinese-naming | 取名大师 | 品牌/产品/项目中文命名。寓意、音韵、联想 | 低 | 简单 |

---

## 执行优先级汇总

### 本周必须完成（5 个）
1. **小红书**（原创）- 中国用户最直接需求，零版权风险
2. **前端美化**（复制 frontend-design）- 安装量最高，翻译简单
3. **设计大师**（复制 web-design-guidelines）- 安装量高，翻译简单
4. **头脑风暴**（复制 brainstorming）- 会议明确提到，需求明确
5. **PPT 大师**（复制 revealjs-skill）- 办公场景，中国用户高频

### 下周完成（5 个）
6. **代码审查**（复制 code-review）
7. **安全审计**（复制 owasp-security）
8. **React 宝典**（复制 vercel-react-best-practices）
9. **抖音脚本**（原创）
10. **公众号**（原创）

### 两周内完成（10 个）
11-20：测试驱动、快速调试、项目规划、SEO 大师、文案大师、动效大师、PDF 工具、营销策划、记忆增强、分支管理

---

## 关键仓库索引

| 仓库 | 说明 | Stars |
|------|------|-------|
| [anthropics/skills](https://github.com/anthropics/skills) | Anthropic 官方 Skill 仓库 | 官方 |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | Claude Code 本体，含 frontend-design 等插件 | 官方 |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | 最活跃的 Skill 索引列表 | 8700+ |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 192 个 Skill 的综合库 | 5200+ |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | 500+ Skill 跨平台兼容 | 高 |
| [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) | 1000+ Skill 大合集 | 22000+ |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 营销类 Skill 专集 | 中等 |
| [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp) | OWASP 安全 Skill | 中等 |
| [ryanbbrown/revealjs-skill](https://github.com/ryanbbrown/revealjs-skill) | Reveal.js 演示文稿 Skill | 中等 |
| [supabase/agent-skills](https://github.com/supabase/agent-skills) | Supabase 官方 Agent Skill | 官方 |
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | 13 子技能的 SEO 综合 Skill | 中等 |
| [scoobynko/claude-code-design-skills](https://github.com/scoobynko/claude-code-design-skills) | Figma 转代码 Skill | 中等 |

---

## 注意事项

1. **版权合规**：复制前必须确认原 Skill 的开源协议，在 README 中注明来源
2. **账号隔离**：每个卫星 Skill 使用不同 GitHub 账号发布
3. **真实价值**：每个复制的 Skill 必须经过中文优化和测试，确保真的好用
4. **导流植入**：每个 Skill 中植入技能宝能力缺口推荐，但不硬塞广告
5. **持续更新**：建立上游 Skill 变更监控，重大更新时同步中文版
