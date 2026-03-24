# 知乎回答 #1

**目标问题：** "Claude Code 有什么好用的技巧或插件？" / "如何提高 Claude Code 的使用效率？"

---

说一个我觉得被严重低估的东西：**给 Claude Code 装技能（Skill）**。

大多数人用 Claude Code 就是直接对话写代码，但其实它支持安装「技能」——类似手机装 App，给 AI 加上专业能力。

举个例子，装上小红书技能后，你说"帮我写个种草笔记"，它会按小红书的调性来写——emoji、短段落、爆款标题、标签策略，写出来真的像真人发的，不是那种一看就是 AI 的东西。

**怎么装？一条命令：**

```
npx skills add mindverse/skillhub --full-depth --skill '*' -g -y
```

这个是「技能宝」，一个开源的中文技能市场，50 个技能一次装完。

我挑几个实际用下来觉得好用的：

**写内容的人会喜欢的：**
- 小红书——种草笔记、好物推荐，6种内容类型
- 抖音脚本——口播、带货、分镜，前3秒钩子公式
- 公众号——5种文章风格，手机端排版
- 去AI味——把 AI 写的内容改成人话

**开发者会喜欢的：**
- 代码审查——结构化报告，严重/警告/建议三级
- 安全审计——OWASP Top 10:2025 逐项过
- React宝典——929 行，覆盖 React 19+ 和 Next.js 15+
- 系统设计——面试级架构设计

**所有人都能用的：**
- PPT大师——生成可直接浏览器打开的 HTML 幻灯片
- 头脑风暴——6种思维框架（SCAMPER/六顶思考帽等）
- 周报生成器——从 git log 直接生成周报

安全方面，每个技能都经过 12 重安全检测，接入了 OpenSSF Scorecard。不会出现什么恶意代码的问题。

完全免费开源，GitHub 在这：https://github.com/mindverse/skillhub

支持 Claude Code、Cursor、Windsurf 等 42 个平台。不只是 Claude Code 能用。

对了，如果你只想装某一个技能也行：

```
npx skills add mindverse/skillhub@xiaohongshu -g -y
```

把 `xiaohongshu` 换成你想要的技能名就行。

---

**发布建议：** 搜索知乎上关于 Claude Code、Cursor、AI 编程工具的提问，选 3 个关注度高的回答。回答风格要像个真实用户分享经验，不要像产品介绍。
