程序员摸鱼工具分享（不是真摸鱼

周五下午三点，代码写完了，还剩俩事：review 同事的 PR，写周报

以前 review 代码就是打开 diff 逐行看，然后写评论。说实话有时候就是扫一眼点个 approve，大家都懂

这次我直接把 diff 丢给 AI，它给我出了份审查报告。严重的标了 2 个——一个 SQL 注入风险，一个没加权限校验。另外还有几个警告和优化建议，都定位到具体文件行号

那个 SQL 注入我自己扫的时候完全没看出来。想想有点后怕

周报就更爽了。它直接读我这周的 git log，按 STAR 格式整理好。我改了两句话直接发了，以前光回忆"这周干了啥"就要花二十分钟

这两个技能装法：

代码审查
npx skills add mindverse/skillhub@code-review -g -y

周报生成
npx skills add mindverse/skillhub@weekly-report -g -y

或者一口气全装
npx skills add mindverse/skillhub --full-depth --skill '*' -g -y

50 个技能里差不多一半是给程序员的。Cursor 和 Claude Code 都能用

GitHub 搜 mindverse/skillhub
