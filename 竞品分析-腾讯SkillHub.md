# 竞品分析报告：腾讯 SkillHub & skills.sh (Vercel)

> 调研日期：2026-03-18
> 调研范围：腾讯 SkillHub (skillhub.tencent.com)、skills.sh (Vercel)、skillhub.club、agentskills.io

---

## 一、背景概述

在 AI Agent Skills 生态中，目前存在三个层次的玩家：

| 层次 | 角色 | 代表 |
|------|------|------|
| 标准制定者 | 定义 SKILL.md 格式规范 | Anthropic (agentskills.io) |
| 生态平台 | 构建 CLI 工具 + 发现市场 | Vercel (skills.sh) |
| 区域化社区 | 本地化镜像 + 增值服务 | 腾讯 SkillHub、skillhub.club |

**核心发现：** "腾讯 SkillHub" 并非独立的技能格式或生态，而是基于 Vercel skills.sh / ClawHub 生态之上的**中国区本地化镜像和社区平台**，于 2026 年 3 月 10 日上线，域名为 skillhub.tencent.com。

---

## 二、skills.sh（Vercel）—— 全球主平台

### 2.1 产品形态

- **定位**：开放的 AI Agent Skills 发现与分发平台
- **运营方**：Vercel（"Made with love by Vercel"）
- **域名**：skills.sh
- **CLI 工具**：`npx skills add <owner/repo>`（npm 包名为 `skills`）
- **GitHub 仓库**：github.com/vercel-labs/skills

### 2.2 功能特性

| 功能 | 描述 |
|------|------|
| Skills 排行榜 | 支持 All Time / Trending（24h）/ Hot 三种排序方式 |
| 一键安装 | `npx skills add vercel-labs/agent-skills` |
| 多 Agent 支持 | 支持 40+ Agent：Claude Code、Cursor、GitHub Copilot、Gemini CLI、OpenCode、Cline、Roo Code、Windsurf 等 |
| 全局 / 项目安装 | `-g` 全局安装到 `~/.claude/skills/`，默认项目级安装到 `.agents/skills/` |
| Symlink 优先 | 默认使用符号链接安装（单一数据源），可选 `--copy` 复制模式 |
| 交互式发现 | `npx skills find [query]` 交互式搜索 |
| 版本管理 | `npx skills check` / `npx skills update` |
| Skill 创建模板 | `npx skills init [name]` 生成 SKILL.md 模板 |
| Plugin Marketplace 兼容 | 支持 `.claude-plugin/marketplace.json` 格式 |

### 2.3 UI 描述

- 首页顶部展示标语："Skills are reusable capabilities for AI agents"
- 支持的 Agent 品牌 Logo 滚动展示（双行滚动轮播）
- 主体为 Leaderboard 排行榜表格，展示 Skill 名称、作者/仓库、安装量
- 支持 All Time / Trending / Hot 三个标签切换排序
- 总计跟踪 89,133 个 Skills（All Time 统计）
- 底部注明 "Made with love by Vercel"

### 2.4 热门 Skills Top 20（按全部时间安装量排序）

| 排名 | Skill 名称 | 作者/仓库 | 安装量 |
|------|-----------|-----------|--------|
| 1 | find-skills | vercel-labs/skills | 595.6K |
| 2 | vercel-react-best-practices | vercel-labs/agent-skills | 220.6K |
| 3 | web-design-guidelines | vercel-labs/agent-skills | 174.9K |
| 4 | frontend-design | anthropics/skills | 168.9K |
| 5 | remotion-best-practices | remotion-dev/skills | 153.2K |
| 6 | azure-ai | microsoft/github-copilot-for-azure | 139.0K |
| 7 | azure-deploy | microsoft/github-copilot-for-azure | 138.6K |
| 8 | azure-storage | microsoft/github-copilot-for-azure | 138.6K |
| 9 | azure-cost-optimization | microsoft/github-copilot-for-azure | 138.6K |
| 10 | azure-diagnostics | microsoft/github-copilot-for-azure | 138.5K |
| 11-23 | azure-* 系列 (13 个) | microsoft/github-copilot-for-azure | 138.0-138.4K |
| 24 | agent-browser | vercel-labs/agent-browser | 107.1K |
| 25 | azure-hosted-copilot-sdk | microsoft/github-copilot-for-azure | 106.2K |
| 26 | vercel-composition-patterns | vercel-labs/agent-skills | 89.0K |
| 27 | skill-creator | anthropics/skills | 88.9K |
| 28 | azure-compute | microsoft/github-copilot-for-azure | 71.1K |
| 29 | ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill | 67.4K |
| 30 | ai-image-generation | inferen-sh/skills | 63.9K |

**关键观察**：Microsoft Azure 系列占据了 Top 30 中 约 20 个位置（~2.5M 总安装量），Vercel 自身 Skills 和 Anthropic 官方 Skills 占据其余头部位置。

### 2.5 安装方式

```bash
# 从 GitHub 仓库安装
npx skills add vercel-labs/agent-skills

# 从完整 URL 安装
npx skills add https://github.com/vercel-labs/agent-skills

# 从本地路径安装
npx skills add ./my-local-skills

# 全局安装
npx skills add -g vercel-labs/agent-skills

# 指定 Agent
npx skills add -a claude-code vercel-labs/agent-skills

# 指定特定 Skill
npx skills add -s pdf-processing vercel-labs/agent-skills
```

安装路径：
- 项目级：`.claude/skills/`（Claude Code）、各 Agent 各有对应目录
- 全局级：`~/.claude/skills/`

### 2.6 安全机制

**当前状态：安全机制仍处于早期建设阶段**

已有机制：
- `allowed-tools` 字段：SKILL.md 前置声明预授权工具列表（实验性功能）
- `compatibility` 字段：声明环境依赖
- `metadata.internal` 标记：隐藏非公开 Skills
- 遥测数据收集（可通过 `DISABLE_TELEMETRY` 或 `DO_NOT_TRACK` 关闭）
- 建议"像审查代码一样审查 Skills"

**正在建设中**（GitHub Issues 显示）：
- Issue #617：RFC - Skill 安装时签名验证（2026-03-13 提出，Open 状态）
- Issue #613：安装前安全扫描（2026-03-13 提出，Open 状态）
- Issue #628：安全审计视图（2026-03-14 提出，Open 状态）

**已公布的安全合作伙伴**（来自 Vercel 2026-02-20 博客）：
- **Socket**：跨生态静态分析 + LLM 过滤，报告精度 95%、召回 98%、F1 97%
- **Gen**：构建 "Sage" 实时代理信任层，监控数据泄露和提示注入风险
- **Snyk**：将包安全专业知识应用到 Skills 上下文

计划推出 "Audits Leaderboard"（每个 Skill 的安全评估）。

**已知安全隐患**（GitHub Issues）：
- Issue #606：`.skill-lock.json` 重写有损，同名 Skills 来自不同源会冲突（供应链混淆风险）
- Issue #605：CLI 测试使用 `-g` 会修改真实用户全局状态
- Issue #604：`skills remove --all -g` 会删除非托管 Skills

---

## 三、腾讯 SkillHub (skillhub.tencent.com)

### 3.1 产品形态

- **定位**：专为中国用户优化的 AI Skills 社区
- **上线时间**：2026 年 3 月 10 日
- **域名**：skillhub.tencent.com
- **技术基础**：基于 ClawHub 生态（OpenClaw 的公共 Skills 注册中心）整合了 13,000+ AI Skills
- **基础设施**：腾讯云 CDN（cloudcache.tencent-cloud.com），DNSPod 域名服务

### 3.2 核心功能特性

| 功能 | 描述 |
|------|------|
| 高速下载 | 国内镜像加速下载，解决海外 Skills 社区下载慢的痛点 |
| 精选榜单 | Top 50 AI Skills 精选榜单 |
| 中文搜索 | 重构的中文搜索和分类体验 |
| 一键安装 | 支持 Lighthouse 面板、命令行、本地环境一键安装 |
| 多框架兼容 | 兼容 OpenClaw、WorkBuddy、QClaw 等 AI Agent 框架 |
| 安全审计 | 三层保护：官方认证 + 加速下载 + 安全审计 |
| 平台支持 | 支持 Lighthouse 面板、Mac 环境、AI Coding 场景 |

### 3.3 UI 描述

基于搜索结果和技术分析（skillhub.tencent.com 页面为 JS 渲染的 SPA 应用）：
- 部署在腾讯云基础设施上
- 语言设置为中文 (zh)
- 支持 IE 浏览器检测和降级提示
- 集成百度统计分析
- 内置微信分享能力
- 支持微信浏览器内字体自适应
- OAuth 接口预留了微信和 QQ 登录（当前实例未启用）
- 验证码服务（App ID: 2021704706）

### 3.4 安装方式

根据收集到的信息，腾讯 SkillHub 提供三种安装方式：

1. **Lighthouse 面板安装**：通过腾讯云 Lighthouse 控制台的图形界面一键安装
2. **命令行安装**：CLI 工具安装（具体命令格式未公开详细文档）
3. **本地环境安装**：手动放置 SKILL.md 文件到对应 Agent 的 skills 目录

### 3.5 安全机制

"三层保护"体系：
1. **官方认证**：对精选 Skills 进行官方审核认证
2. **加速下载**：国内镜像保障下载完整性和速度
3. **安全审计**：对 Skills 进行安全审查

具体的审计深度、审查标准和自动化程度尚未有公开详细文档。

### 3.6 与 skills.sh 的关系

腾讯 SkillHub 不是 skills.sh 的直接竞争对手，而更像是**下游本地化平台**：
- 内容来源于 ClawHub 生态（与 skills.sh 共享 Agent Skills 标准）
- 解决中国用户访问 skills.sh 的网络速度问题
- 提供中文化搜索和分类体验
- 添加本土化增值服务（腾讯云集成、微信生态、安全审计）

---

## 四、skillhub.club —— 独立第三方市场

### 4.1 产品形态

- **定位**：Claude Skills & Agent Skills Marketplace（通用 AI Agent Skills 市场）
- **规模**：30,000+ Skills、4.6M Stars
- **独立运营**，非腾讯产品

### 4.2 核心功能

| 功能 | 描述 |
|------|------|
| CLI 安装 | `npx @skill-hub/cli install frontend-design` |
| 语义搜索 | `npx @skill-hub/cli search "react"` |
| Playground | 浏览器内直接测试 Skills，无需安装，支持实时流式输出 |
| Skill 评分系统 | 五维评分（实用性、清晰度、自动化、质量、影响力），S-Rank (9.0+)、A-Rank (8.0+) |
| Skill Stacks | Pro 会员预配置的 Skill 组合包 |
| 桌面应用 | 一键桌面端安装 |
| BYOK（自带密钥）| 用户可使用自己的 API Key |
| 开发者 API | 基于用量的 API 访问 |

### 4.3 商业模式

| 层级 | 价格 | 权益 |
|------|------|------|
| Free | 免费 | 每日 2 次查询，有限 Playground |
| Pro | $9.99/月 | 每日 50 次查询，优先搜索，抢先体验 |
| Credits | 按量购买 | 不过期，API 访问 |

### 4.4 安全特性

- 沙箱执行环境：无网络访问
- 仅限预装 Python 库
- 最大 30 分钟超时（BYOK 模式）
- 文件上传限制 10MB
- API Key 加密存储

### 4.5 热门 Skills（Trending）

| Skill | 作者 | Stars |
|-------|------|-------|
| apple-notes | @openclaw | 282,955 |
| bird | @moltbot | 242,962 |
| video-frames | @moltbot | 236,106 |
| goplaces | @openclaw | 229,809 |
| blucli | @openclaw | 219,060 |

### 4.6 S-Rank Skills

| Skill | 作者 | 评分 | 用途 |
|-------|------|------|------|
| systematic-debugging | @obra | 9.2 | 根因分析方法论 |
| skill-creator | @davepoon | 9.1 | 创建 Claude Skills 框架 |
| file-search | @massgen | 9.0 | Ripgrep/ast-grep 代码探索 |
| backend-models-standards | @maxritter | 9.0 | 数据库建模指南 |

---

## 五、Agent Skills 技术标准（agentskills.io）

### 5.1 标准概述

- **发起者**：Anthropic 原创，现为开放标准
- **规范网站**：agentskills.io
- **GitHub**：github.com/agentskills/agentskills
- **支持的 Agent 数量**：30+ 主流 AI 编码工具

### 5.2 SKILL.md 格式规范

```yaml
---
name: pdf-processing          # 必填：1-64 字符，小写+连字符
description: Extract PDF...   # 必填：1-1024 字符
license: Apache-2.0           # 可选
compatibility: Requires git   # 可选：最长 500 字符
metadata:                     # 可选：任意键值对
  author: example-org
  version: "1.0"
allowed-tools: Bash(git:*) Read  # 可选：预授权工具列表（实验性）
---

# 正文：Markdown 格式的指令内容
```

### 5.3 目录结构

```
skill-name/
├── SKILL.md          # 必需：元数据 + 指令
├── scripts/          # 可选：可执行代码
├── references/       # 可选：参考文档
├── assets/           # 可选：模板、资源
└── ...
```

### 5.4 渐进式披露机制

1. **Discovery 阶段**（~100 tokens）：仅加载 name + description
2. **Activation 阶段**（< 5000 tokens 推荐）：加载完整 SKILL.md
3. **Execution 阶段**（按需）：加载 scripts/、references/、assets/

---

## 六、对比分析

### 6.1 三平台对比

| 维度 | skills.sh (Vercel) | 腾讯 SkillHub | skillhub.club |
|------|-------------------|---------------|---------------|
| 上线时间 | 2025 年下半年 | 2026-03-10 | 不详 |
| 运营方 | Vercel | 腾讯 | 独立开发者 |
| Skills 总量 | 89,133 | 13,000+ | 30,000+ |
| 总安装量 | 2,000,000+ | 不详 | 4.6M Stars |
| 目标用户 | 全球开发者 | 中国开发者 | 全球开发者 |
| CLI 工具 | `npx skills add` | Lighthouse/CLI | `npx @skill-hub/cli` |
| Agent 支持 | 40+ | OpenClaw/WorkBuddy/QClaw | Claude Code/Codex/Gemini 等 |
| 安全机制 | 合作伙伴审计（建设中） | 三层保护体系 | 沙箱执行环境 |
| 商业模式 | 免费开放 | 免费（腾讯云生态） | Freemium ($9.99/月 Pro) |
| Playground | 无 | 不详 | 有（浏览器内测试） |
| 评分体系 | 仅安装量排名 | Top 50 精选榜单 | 五维评分 S/A/B/C |
| 中文支持 | 无 | 原生中文 | 无（英文为主） |
| 云集成 | Vercel 部署 | 腾讯云 Lighthouse | 无 |

### 6.2 腾讯 SkillHub 的差异化优势

1. **网络加速**：国内镜像 CDN 解决海外 Skills 下载慢的刚需
2. **中文本地化**：中文搜索、分类、UI 界面
3. **腾讯云生态集成**：与 Lighthouse 面板深度集成，一键部署
4. **微信生态**：预留微信/QQ OAuth、微信分享能力
5. **安全审计**：官方认证 + 安全审计的三层保护

---

## 七、弱点与缺失能力分析

### 7.1 腾讯 SkillHub 的弱点

| 弱点类别 | 具体描述 |
|---------|---------|
| **上线时间晚** | 2026-03-10 刚上线，比 skills.sh 晚约半年，生态积累不足 |
| **内容依赖上游** | Skills 内容主要来自 ClawHub 生态，缺乏独家原创 Skills |
| **Agent 支持窄** | 主要支持 OpenClaw/WorkBuddy/QClaw 等非主流 Agent，对 Claude Code、Cursor、GitHub Copilot 等主流工具的支持不如 skills.sh |
| **文档匮乏** | 公开文档极少，安全审计标准、API 文档、开发者指南均未公开 |
| **社区早期** | 刚上线不到 2 周，用户评价和社区讨论几乎为零 |
| **商业模式不清** | 免费提供但无明确的商业化路径或开发者激励机制 |
| **探索页 404** | skillhub.tencent.com/explore 返回 404（DNSPod 错误页），部分功能尚未就绪 |
| **OAuth 未启用** | 微信/QQ 登录接口已预留但当前未启用 |
| **安全审计不透明** | "三层保护"缺乏具体技术细节：审计范围、检测方法、报告公开机制均不明 |
| **Skills 质量难保证** | 13,000+ Skills 来自上游同步，精选 Top 50 仅覆盖 <0.4% 的内容 |

### 7.2 skills.sh (Vercel) 的弱点

| 弱点类别 | 具体描述 |
|---------|---------|
| **安全机制不成熟** | 签名验证、安装前扫描、安全审计视图均为 Open Issue，尚未实现 |
| **供应链风险** | 同名 Skills 冲突、lock 文件有损重写（Issue #606），存在 Skills 投毒风险 |
| **无沙箱执行** | Skills 中的脚本直接在用户环境执行，无隔离 |
| **无中文支持** | 对中国用户不友好，搜索和内容均为英文 |
| **排行榜失真** | Azure 系列 Skills 批量注册导致 Top 30 中约 20 个是同一来源的 Azure Skills |
| **无 Playground** | 无法在线试用 Skills，必须先安装 |
| **无评分体系** | 仅按安装量排名，无质量评分或用户评价系统 |
| **无商业模式** | 纯免费开放，缺乏长期可持续运营的商业模式 |
| **测试隔离差** | CLI 测试使用 `-g` 会修改真实用户状态（Issue #605） |
| **危险的 remove 操作** | `skills remove --all -g` 会删除非托管 Skills（Issue #604） |

### 7.3 整个 Agent Skills 生态的共同弱点

1. **标准碎片化风险**：skills.sh 的 `npx skills`、skillhub.club 的 `npx @skill-hub/cli`、腾讯的独立安装方式——CLI 工具不统一
2. **信任机制缺失**：Skills 本质是注入 Agent 上下文的提示词，存在提示注入攻击风险
3. **版本锁定能力弱**：依赖 Git 仓库版本，缺乏类似 npm lockfile 的严格版本锁定
4. **无权限隔离**：`allowed-tools` 字段仍为实验性，且由 Agent 自行决定是否遵守
5. **质量参差不齐**：89,000+ Skills 中大量低质量内容，缺乏有效的质量把关机制

---

## 八、结论与启示

### 8.1 市场格局

- **skills.sh (Vercel)** 是当前事实标准，占据生态主导地位（89K+ Skills、2M+ 安装量、40+ Agent 支持）
- **腾讯 SkillHub** 是中国区本地化镜像，核心价值在于网络加速和中文体验，但尚处于早期
- **skillhub.club** 作为独立第三方平台，在商业化（Freemium）和产品体验（Playground、评分系统）上有差异化创新

### 8.2 关键机会点

1. **安全与信任**：整个生态的安全机制都处于早期，谁先建立可信的审计体系谁就有竞争壁垒
2. **中文本地化**：中国开发者市场需求强烈，但当前方案（单纯镜像）深度不够
3. **质量评分**：skills.sh 缺乏质量评估体系，这是重要的差异化机会
4. **Playground / 在线试用**：skillhub.club 已验证这个需求存在
5. **开发者激励**：目前所有平台都缺乏对 Skill 创作者的激励机制
6. **企业级功能**：私有 Skills 管理、团队协作、审批流程——企业付费意愿更强

### 8.3 对我们的建议

- 腾讯 SkillHub 上线仅 1 周多，产品成熟度低，当前窗口期仍然开放
- 安全审计和质量评分是最大的差异化机会，因为 skills.sh 的安全机制仍在 RFC 阶段
- 中文社区和本土 Agent（如 Tencent 的 WorkBuddy/QClaw）的支持是腾讯的护城河，但主流 Agent（Claude Code、Cursor 等）的生态仍被 skills.sh 主导
- Playground 在线试用体验是提升转化率的关键功能
