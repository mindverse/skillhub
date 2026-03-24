# 技能宝 SkillHub

全网最大中文 AI Skill 搜索引擎。收录 5,000+ 技能，中文搜索，安全评级，一键安装。

## 这是什么

技能宝是一个 AI 技能的搜索引擎和注册中心，类似「AI 技能的淘宝」：

- **搜索** — 中英文搜索全网 5,000+ AI Skill
- **安全评级** — 每个 Skill 经过 12 重安全检测，S/A/B/C/D 五级评分
- **一键安装** — 终端一条命令装好，支持 Claude Code、Cursor、Windsurf 等 42 个平台
- **官方精选** — 50 个自研中文优化 Skill，质量保证

## 快速开始

### 一键安装全部精选技能

```bash
npx skills add mindverse/skillhub --full-depth --skill '*' -g -y
```

### 搜索并安装单个技能

```bash
# 安装 CLI
npm i -g jinengbao

# 搜索
jinengbao search "小红书"

# 安装
jinengbao add mindverse/skillhub@xiaohongshu

# 排行榜
jinengbao trending
```

## 精选技能一览

| 技能 | 类型 | 说明 |
|------|------|------|
| 小红书 | 原创 | 种草笔记、好物推荐、探店测评，写出来像真人发的 |
| PPT大师 | 增强 | Reveal.js 幻灯片，15 套配色，浏览器直接打开 |
| 代码审查 | 增强 | 逐文件审查，严重/警告/建议三级结构化报告 |
| 设计大师 | 增强 | 完整设计系统，配色/字体/间距/无障碍，642 行 |
| 安全审计 | 增强 | OWASP Top 10 逐项检查，CWE 编号修复建议 |
| 头脑风暴 | 增强 | 6 种思维框架，从发散到收敛到可行性评估 |
| 抖音脚本 | 原创 | 口播/带货/剧情/分镜/Vlog，前 3 秒钩子公式 |
| 去AI味 | 原创 | 把 AI 生成的中文改写成人话 |

[查看全部 50 个精选技能 →](https://dashboard-app-omega-lyart.vercel.app/skills?ours=true)

## 项目结构

```
skillhub/
├── dashboard-app/          # Next.js 搜索引擎网站
│   ├── src/app/            # 页面（首页/搜索/详情/排行榜/提交）
│   ├── src/app/api/        # API（搜索/详情/排行/分类/提交/统计/爬虫）
│   ├── src/lib/            # Supabase 客户端、爬虫、安全扫描器
│   └── supabase-schema.sql # 数据库 Schema
├── cli/                    # jinengbao CLI 工具
├── skills/                 # 50 个自研 Skill 源文件
├── registry/               # 5,033 条 Skill 元数据索引
└── tools/                  # 安全评分脚本
```

## 架构

```
全网 GitHub SKILL.md
       │
  ┌────┼────────────┐
  │ 爬虫(每日)   作者提交 │
  └────┼────────────┘
       │
   ┌───▼────┐
   │Indexer │  解析 → 安全评分 → 中文化 → 入库
   └───┬────┘
       │
   ┌───▼──────┐
   │ Supabase │  全文搜索（中英文）
   └───┬──────┘
       │
  ┌────┼──────────┐
  │    │          │
 网站  API       CLI
```

## 与 skills.sh 的差异

| | skills.sh | 技能宝 |
|-|-----------|--------|
| 语言 | 英文 | **中文优先** |
| 安全 | 无评分 | **S/A/B/C/D 五级，12 项检测** |
| 发现 | 按安装量 | **编辑精选 + 分类 + 安全分** |
| 自营 | 无 | **50 个官方精选** |

## 开发

```bash
# 网站开发
cd dashboard-app
cp .env.local.example .env.local  # 填入 Supabase 密钥
npm install
npm run dev

# 数据库初始化
# 1. 在 Supabase SQL Editor 执行 supabase-schema.sql
# 2. 运行种子脚本
npm run seed
```

## 提交你的 Skill

```bash
jinengbao submit your-name/your-repo
```

或访问 [提交页面](https://dashboard-app-omega-lyart.vercel.app/submit)。

要求：仓库包含 SKILL.md、有 frontmatter、开源许可证、无恶意代码。

## License

MIT
