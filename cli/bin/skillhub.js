#!/usr/bin/env node

import { Command } from 'commander';
import { init } from '../lib/init.js';
import { dev } from '../lib/dev.js';
import { publish } from '../lib/publish.js';
import { search } from '../lib/search.js';
import { add } from '../lib/add.js';
import { trending } from '../lib/trending.js';
import { submit } from '../lib/submit.js';

const program = new Command();

program
  .name('skillhub')
  .description('技能宝 CLI — AI 技能搜索引擎')
  .version('2.0.0');

// === 用户命令 ===

program
  .command('search <query>')
  .description('搜索 AI 技能（中英文）')
  .option('-c, --category <cat>', '按分类过滤（开发工具/内容创作/设计/...）')
  .option('-s, --safety <levels>', '按安全等级过滤（S,A,B）')
  .option('--sort <by>', '排序方式（relevance/stars/installs/safety/newest）', 'relevance')
  .option('-l, --limit <n>', '显示数量', '10')
  .option('--ours', '只显示官方精选')
  .action(search);

program
  .command('add <repo>')
  .description('安装 Skill（支持 owner/repo 或关键词）')
  .action(add);

program
  .command('trending')
  .description('查看排行榜')
  .option('--by <metric>', '排序方式（stars/installs/safety）', 'stars')
  .option('-l, --limit <n>', '显示数量', '15')
  .action(trending);

program
  .command('submit <repo>')
  .description('提交你的 Skill 到技能宝收录')
  .action(submit);

// === 开发者命令 ===

program
  .command('init [name]')
  .description('交互式创建新 Skill')
  .action(init);

program
  .command('dev')
  .description('预览并检查当前目录的 Skill')
  .action(dev);

program
  .command('publish')
  .description('发布 Skill')
  .action(publish);

program.parse();
