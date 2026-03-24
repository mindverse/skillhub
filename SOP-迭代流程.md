# 技能宝日常迭代 SOP

> 每次迭代（不管是开发新功能、写新 Skill、发推广内容）都必须走这个流程。

---

## 迭代流程（5 步，不可跳过）

```
Step 1: 对齐 OKR
    ↓
Step 2: 执行任务
    ↓
Step 3: 更新 OKR + ROADMAP
    ↓
Step 4: 产品审视（/ops-product-review）
    ↓
Step 5: 修复断裂点 + 推送
```

### Step 1: 对齐 OKR（每次开始前）

```bash
# 读取当前 OKR 和 Roadmap
cat OKR.md
cat ROADMAP.md
```

确认：
- 当前最高优先级的 KR 是哪个？
- 我要做的事情对应哪个 KR？
- 有没有更高优先级的事被忽略了？

**优先级顺序：O1 安装量 > O2 内容库 > O5 导流 > O3 安全 > O4 生态 > O6 竞争**

### Step 2: 执行任务

根据任务类型调用对应 Agent：

| 任务类型 | 调用 |
|---------|------|
| 写新 Skill | 直接写 SKILL.md |
| 推广增长 | `/ops-growth` |
| 写推广内容 | `/ops-content`（写完必须过 `/humanizer-zh`） |
| 发小红书 | `/ops-content` → `/humanizer-zh` → `/baoyu-xhs-images` → `/post-to-xhs` |
| 社区管理 | `/ops-community` |
| 看数据 | `/ops-data` |
| 审视产品 | `/ops-product-review` |

### Step 3: 更新 OKR + ROADMAP

```bash
# 更新受影响的 KR 数据
edit OKR.md

# 勾选完成的 Roadmap 项
edit ROADMAP.md
```

### Step 4: 产品审视（硬规则）

```
/ops-product-review
```

这一步**不可跳过**。每次迭代后都要从用户视角走一遍：
- 发现入口通畅吗？
- 安装能成功吗？
- 使用体验断裂了吗？
- 新改的东西有没有破坏已有体验？

输出审视报告，保存到 `reports/` 目录。

### Step 5: 修复断裂点 + 推送

- 如果审视发现断裂点 → 立即修复
- 修复后推送 GitHub
- 如果涉及网站 → 重新部署 Vercel

```bash
# 推送 GitHub
cd /tmp/skill-hub-publish && git add -A && git commit -m "..." && git push

# 部署网站（如果改了 dashboard-app）
cd dashboard-app && npm run build && vercel --prod --yes
```

---

## 运营 Agent 使用指南

### 完整工具链

```
/ops-growth      → 增长策略、渠道分析、投放文案
/ops-content     → 写推广内容（6 个平台）
/ops-community   → GitHub 社区、PR 跟进、开发者外联
/ops-data        → 数据报告、指标监控、竞品分析
/ops-product-review → 用户视角体验检查
```

### 内容发布一条龙

```
小红书：/ops-content → /humanizer-zh → /baoyu-xhs-images → /post-to-xhs
公众号：/ops-content → /humanizer-zh → /wechat-mp → 手动发布
抖音：  /ops-content → /humanizer-zh → /douyin-script → 手动拍摄
其他：  /ops-content → /humanizer-zh → 保存到 content/ → 手动发布
```

### 关键规则

1. **所有对外内容必须过 `/humanizer-zh`** — 去 AI 味
2. **每次迭代必须跑 `/ops-product-review`** — 找断裂点
3. **数据驱动决策** — 先 `/ops-data` 看数据，再决定做什么
4. **OKR 实时更新** — 每个动作完成后立即更新 OKR.md

---

## 周期性任务

| 频率 | 任务 | Agent |
|------|------|-------|
| 每次迭代 | 产品审视 | `/ops-product-review` |
| 每周 | 数据周报 | `/ops-data` |
| 每周 | PR 状态跟进 | `/ops-community` |
| 每月 | OKR 复盘 + 调整 | CEO 手动 |
| 每月 | 竞品深度分析 | `/ops-data` |
