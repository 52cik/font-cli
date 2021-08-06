import fs from 'fs';
import { resolve } from 'path';
import ora from 'ora';
import chalk from 'chalk';
import meow from 'meow';
import generator from './generator';

const example = `
  # 生成组件到 IconFont 目录
  font //at.alicdn.com/t/font_2404456_tifhzvgpsp.js
  # 生成组件到 src/components/MyIcon 目录
  font //at.alicdn.com/t/font_2404456_tifhzvgpsp.js -o src/components/MyIcon
  # 生成组件到 IconFont 目录，并去除图标名 icon- 前缀
  font --prune //at.alicdn.com/t/font_2404456_tifhzvgpsp.js
  # 生成组件到 IconFont 目录，并替换图标名 icon- 前缀为 myicon-
  font --prune icon-=myicon- //at.alicdn.com/t/font_2404456_tifhzvgpsp.js
  # 生成 font.config.json 配置到当前目录
  font --init
  # 生成 myconfig.json 配置到当前目录
  font --init myconfig.json
  # 调用自定义配置
  font -c myconfig.json
  # 调用 font.config.json 配置，如果配置不存在则输出帮助信息
  font
`.replace(/#[^\r\n]+/g, (line) => chalk.green(line));

const cli = meow(`
使用:
  font [参数] [url]

参数:
  -t, --type      只生成类型
  -p, --preview   只生成预览文件
  -o, --out       自定义生成路径 [默认: IconFont]
  -c, --config    自定配置文件 [默认: font.config.json]
      --init      生成配置文件
      --prune     修剪图标名前缀
  -s, --singleton 单例模式，多次多版本加载，只会保留最新一份
  -h, --help      显示帮助
  -v, --version   显示版本

例子: ${example}
`, {
  flags: {
    type: { alias: 't', type: 'boolean' },
    preview: { alias: 'p', type: 'boolean' },
    out: { alias: 'o', type: 'string', default: 'IconFont' },
    config: { alias: 'c', type: 'string' },
    init: { type: 'string' },
    prune: { type: 'string' },
    singleton: { alias: 's', type: 'boolean' },
    help: { alias: 'h', type: 'boolean' },
    debug: { alias: 'd', type: 'boolean' },
    version: { alias: 'v', type: 'boolean' },
  },
});

const defaultConfig = 'font.config.json';
const getCfgPath = (file?: string) => resolve(process.cwd(), file || defaultConfig);
const hasConfig = fs.existsSync(getCfgPath(cli.flags.config));

// 生成配置
if (cli.flags.init !== undefined) {
  const cfgPath = getCfgPath(cli.flags.init);
  if (fs.existsSync(cfgPath)) {
    console.log('配置已存在');
    process.exit();
  }
  const cfg = [{
    url: '//at.alicdn.com/t/font_2404456_tifhzvgpsp.js',
    out: 'src/components/IconFont',
    singleton: true,
  }];
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
  process.exit();
}

// 输出版本
if (cli.flags.v) {
  cli.showVersion();
  process.exit();
}

// 输出帮助
if (cli.flags.h || (!cli.input.length && !hasConfig)) {
  cli.showHelp();
  process.exit();
}

let configs = [];

// 通过配置文件生成参数
if (hasConfig && cli.input.length === 0) {
  const cfgPath = getCfgPath(cli.flags.config);

  if (!fs.existsSync(cfgPath)) {
    console.warn('配置文件不存在，请检查配置。');
    process.exit();
  }

  const cfg = require(cfgPath);
  configs = (Array.isArray(cfg) ? cfg : [cfg]).map((it) => ({
    url: it.url,
    out: it.out || 'IconFont',
    type: it.type || cli.flags.preview,
    preview: it.preview || cli.flags.preview,
    prune: it.prune || cli.flags.prune,
    singleton: it.singleton || cli.flags.singleton,
  }));
} else {
  // 通过命令行参数生成
  configs = [{
    url: cli.input[0],
    out: cli.flags.out || 'IconFont',
    type: cli.flags.type,
    preview: cli.flags.preview,
    prune: cli.flags.prune,
    singleton: cli.flags.singleton,
  }];
}

const spinner = ora('生成中...').start();
const tasks = configs.map((it) => generator(it).catch((err) => {
  console.log(`\n  ${it.url} 生成失败！\n  ${err.message}`);
  if (cli.flags.debug) {
    console.error(err);
  }
  return err;
}));

Promise.all(tasks).then((rets) => {
  const hasError = rets.filter((it) => it !== true).length;
  if (hasError) {
    spinner.fail(`${hasError} 个任务处理失败!`);
  } else {
    spinner.succeed('处理完成!');
  }
});
