# Agent 团队演化记录 v2

> 2026-03-21 PM 自我审视后的演化计划

## 发现的 7 个问题

1. Agent 之间信息孤岛（不知道彼此做了什么）
2. PM 太胖（诊断+执行+记录全自己干）
3. 产品经理和产品审视职责重叠
4. ops-tech 太薄（69行，缺项目知识）
5. ops-community 形同虚设（0次有效调用）
6. 绩效追踪没跟上迭代速度
7. OKR 数据散在多处（OKR.md / 面板 / skills-data 三处不同步）

## 演化方案

### 1. 共享上下文：所有 Agent 启动时读最近日志
每个 Agent 的启动流程加一步：
```bash
tail -20 /Users/baofangyi/mono/skillhub/tracking/work-log.md
```
让每个 Agent 知道团队最近在干什么，避免重复或冲突。

### 2. PM 瘦身：只做决策层
PM 不直接写内容、不直接改代码。PM 的输出只有：
- 行动计划（谁做什么）
- 调度指令（调用哪个 Agent）
- 状态汇报（给 CEO 看）
- 日志更新（记录发生了什么）

### 3. 合并产品经理和产品审视
合并为 `/ops-product`，内部两种模式：
- `optimize` 模式：主动优化 User Journey、首页、转化率
- `review` 模式：被动检查断裂点（每次迭代后必跑）

### 4. ops-tech 增强
注入项目结构知识：
- GitHub 仓库结构（skills/ / registry/ / tools/）
- dashboard-app 结构（Next.js App Router）
- 发布流程（git push → vercel deploy）
- 代码规范（Skill frontmatter 格式）

### 5. ops-community 加主动任务
改为定期任务驱动：
- 每 3 天 bump 未回应的 PR
- 每周找 5 个目标开发者外联
- 每两周写 1 个 GitHub Discussion

### 6. 自动化追踪
PM 每次调度完 Agent 后，自动追加 work-log.md。
格式固定，不依赖记忆。

### 7. 单一数据源
CEO 面板从 GitHub API + OKR.md 动态读取数据。
删除 skills-data.ts 的硬编码 Skill 列表，改为构建时从 skills/ 目录自动生成。

## 优先级
1. 共享上下文（影响所有 Agent）→ 立即做
2. ops-tech 增强（影响技术执行质量）→ 立即做
3. PM 瘦身（影响执行效率）→ 本周做
4. 合并产品 Agent（减少混淆）→ 本周做
5. 其余 → 下周迭代
