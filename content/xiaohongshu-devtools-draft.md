程序员摸鱼工具分享（不是真摸鱼

周五下午三点，代码写完了，但还有两件事：review 同事的 PR，和写周报

以前 review 代码我会打开 diff 逐行看，然后写评论。说实话有时候就是扫一眼点个 approve，大家都懂

这次我把 diff 丢给 AI，它给我出了份结构化的审查报告。分三级：严重问题 2 个（一个 SQL 注入风险，一个没加权限校验），警告 3 个，建议 5 个。每个都定位到具体文件和行号

那个 SQL 注入我肉眼扫的时候没看出来。有点后怕

周报更离谱。它直接读了我这周的 git log，按 STAR 格式给我整理好了。我改了两句话就发了。以前周报至少花 20 分钟回忆这周干了啥

这两个技能装法：

代码审查
npx skills add mindverse/skillhub@code-review -g -y

周报生成
npx skills add mindverse/skillhub@weekly-report -g -y

或者一口气全装了
npx skills add mindverse/skillhub --full-depth --skill '*' -g -y

50 个技能里大概一半是给程序员用的。Cursor 和 Claude Code 都行

GitHub 搜 mindverse/skillhub
