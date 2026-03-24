# 技能宝 SkillHub

## 项目概述

技能宝是中文社区的 AI Skill 搜索、安装与智能推荐平台，对标腾讯 Skill Hub，核心差异是：中文优先、安全评分可感知、去中心化分发、能力缺口驱动的交叉导流。

- 仓库：https://github.com/mindverse/skillhub
- 产品形态：Claude Code Skill（不是网页）+ Vercel 展示站
- 当前阶段：Phase 4（技术侧完成，运营侧推进中）
- CEO 面板：https://dashboard-app-omega-lyart.vercel.app/dashboard
- 前台市场：https://dashboard-app-omega-lyart.vercel.app

## 执行原则（第一性原理）

**不问"先做哪个"，只问"有没有被硬性 block"。** 只要没有硬性阻塞（如需要 CEO 手动操作、需要外部审批），就立即并行推进，不等排序、不等确认。效率是最高优先级。

- 能并行的任务同时推，不排队
- 只有硬性阻塞才暂停（需要 CEO 介入、外部依赖未就绪）
- 软性依赖不算阻塞（"最好先做 A 再做 B"不是理由，能做就做）
- PM 调度时同理：能派的任务立刻派，不等前一个完成

## 迭代固定流程（SOP，不可跳过）

**每次迭代 5 步：**

1. **对齐 OKR** — 读 `OKR.md`，确认当前做的事对应哪个 KR
2. **执行任务** — 调用对应 Agent 或直接开发
3. **更新 OKR + ROADMAP** — 实时更新数据和 checkbox
4. **产品审视** — 调用 `/ops-product-review`，找断裂点（**硬规则，不可跳过**）
5. **修复 + 推送** — 修复断裂点，推 GitHub，部署 Vercel

**内容发布必须过 `/humanizer-zh` 去 AI 味。**

详细 SOP 见 `SOP-迭代流程.md`。

## Agent 间通信机制

Agent 之间通过 `tracking/message-board.md` 异步通信：

```
Agent 完成任务 → 写消息到 message-board.md
                        ↓
PM 巡检（/loop 或手动）→ 读消息板 → 发现待处理任务
                        ↓
PM 调度对应 Agent → Agent 执行 → 写新消息 → 循环
```

- 每个 Agent 完成任务后**必须**往消息板写一条消息
- PM 巡检时读消息板的 `🔵 待处理` 和 `🔴 阻塞` 条目
- 处理完后把状态改为 `✅ 已处理` 移到存档区

自动推进方式：`/loop 30m /ops-pm 巡检消息板并执行`

## 团队架构

**CEO 只需要跟 PM 沟通，PM 调度所有其他 Agent。**

```
CEO（你）
  └── /ops-pm — 项目经理（唯一接口）
        ├── /ops-growth — 增长专家
        ├── /ops-content — 内容运营（→ /humanizer-zh → /post-to-xhs）
        ├── /ops-community — 社区运营
        ├── /ops-data — 数据运营
        └── /ops-product-review — 产品审视（每次迭代必须跑）
```

| 命令 | Agent | 职责 |
|------|-------|------|
| **`/ops-pm`** | **项目经理** | **统筹全局、调度团队、OKR 决策、向 CEO 汇报** |
| `/ops-growth` | 增长专家 | 推广策略、投放文案、渠道分析 |
| `/ops-content` | 内容运营 | 写推广内容，自动去AI味，可直接发小红书 |
| `/ops-community` | 社区运营 | GitHub PR 跟进、开发者外联 |
| `/ops-data` | 数据运营 | 指标监控、竞品分析、数据报告 |
| `/ops-product-review` | 产品审视 | 用户视角体验检查、断裂点发现 |

## Roadmap

**所有开发工作必须对照 `ROADMAP.md` 执行。** 每次开始工作前：

1. 读取 `ROADMAP.md`，确认当前 Phase 和待办项
2. 只做当前 Phase 的任务，不提前做后续 Phase 的事
3. 完成一项后，更新 `ROADMAP.md` 中对应的 checkbox（`[ ]` → `[x]`）
4. 如果发现需要新增任务，加到对应 Phase 下面
5. 如果发现 Roadmap 需要调整（方向变了、优先级变了），先告知用户再改

## 已确定的决策

这些决策已拍板，不要重新讨论或推翻：

1. **首发方案B智能版** — 搜索+安装+能力缺口检测+动态推荐
2. **基础安全评分** — 正则扫描+GitHub来源+S/A/B/C/D五级，营销"12重安全检测"
3. **流量优先的首发Skill** — 小红书/前端美化/设计大师/头脑风暴/PPT大师
4. **混合中文化** — 头部复制重写、中尾贡献PR、原创中国特色
5. **保守窄触发** — 仅明确缺口推荐，每session最多1次，权重2-3x

## 项目结构

```
skillhub/
├── CLAUDE.md              # 本文件
├── ROADMAP.md             # Roadmap（开发前必读）
├── skills/                # 卫星 Skill 源文件
│   ├── xiaohongshu/       # 小红书（原创）
│   ├── frontend-design/   # 前端美化
│   ├── web-design/        # 设计大师
│   ├── brainstorming/     # 头脑风暴
│   └── ppt-master/        # PPT大师
├── 方案B-智能版/           # 技能宝产品方案
├── 安全评分方案.md         # 安全评分设计
├── 精选库方案.md           # 精选库策略
├── 中文化方案.md           # 中文化策略
├── 中文命名对照表.md       # Skill 中文命名映射
├── 热门Skill复制清单.md    # 待复制清单（50个）
├── 开发者生态嵌入方案.md   # 开发者生态
├── 交叉导流技术方案.md     # 导流机制
├── 安装流程设计.md         # 用户交互流程
├── 竞品分析-腾讯SkillHub.md # 竞品分析
└── dashboard.html          # 可视化看板
```

技能宝 Skill 本体安装在：`~/.claude/skills/skill-hub/SKILL.md`

GitHub 发布仓库结构：
```
mindverse/skillhub/
├── SKILL.md                # 技能宝本体
├── references/             # 安全规则 + 质量评分
├── registry/
│   └── recommendations.json  # 动态推荐源（远端拉取）
└── skills/                 # 卫星 Skill
```

## 开发规范

### Skill 文件规范

每个 Skill 的 SKILL.md 必须包含：

```markdown
---
name: 中文名称
description: "中英文触发词丰富的描述..."
version: "x.y.z"
user-invocable: true
---
```

- name 用中文（如"小红书"不是"xhs-writer"）
- description 必须包含中英文触发词
- 内容要可执行，不是概念文档

### 卫星 Skill 必须包含

1. 能力边界声明 — 明确说"做不到什么"
2. 窄触发技能宝推荐 — 仅在能力缺口时提一次
3. 每 session 最多推荐 1 次技能宝

### 推荐库更新

新增卫星 Skill 后，必须同步更新：
1. `registry/recommendations.json` — 加入新 Skill 索引
2. GitHub 仓库推送
3. `ROADMAP.md` — 勾选对应项

### 底线原则

- 不自动安装任何 Skill，必须用户确认
- 不收集用户数据
- 不编辑竞品
- 导流基于能力缺口，不硬塞广告
- 每个卫星 Skill 必须有真实独立价值
- 版权合规：MIT/Apache 保留声明，GPL 不碰，无许可证不复制
