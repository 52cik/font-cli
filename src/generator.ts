import fs from 'fs';
import { resolve } from 'path';
import mkdirp from 'mkdirp';
import got from 'got';
import tplFont from './template/font';
import tplIndex from './template/index';
import tplTypes from './template/types';
import tplPreview from './template/preview';
import transformSingleton from './singleton';

interface GeneratorOptions {
  url: string;
  out: string;
  type: boolean;
  preview: boolean;
  prune: string;
  singleton: boolean;
}

async function generator(options: GeneratorOptions) {
  const {
    url,
    out,
    type,
    preview,
    prune,
    singleton,
  } = options;

  if (!/font_\w+_\w+\.js\b/.test(url)) {
    throw Error('无效的URL!');
  }

  const IconFontPath = (name: string) => resolve(process.cwd(), out, name);
  const fontUrl = url.replace(/^(?=\/\/)/, 'https:');
  const { body, headers } = await got(fontUrl, { timeout: 10 * 1000 });
  const lastModified = headers['last-modified'] || Date.now(); // 字体修改时间
  let fontCode = body;

  // 替换图标前缀
  if (prune || prune === '') {
    const [prefix, newPrefix] = (prune || 'icon-').split('=');
    fontCode = body.replace(RegExp(`id="${prefix}`, 'g'), `id="${newPrefix || ''}`);
  }

  const iconNames: string[] = body.match(/[^"]+(?=" viewBox)/g) || [];

  if (!fs.existsSync(IconFontPath('.'))) {
    mkdirp.sync(IconFontPath('.'));
  }

  const writeFile = (name: string, data: string) => fs.writeFileSync(IconFontPath(name), data, 'utf8');

  // 单例模式处理
  if (singleton) {
    fontCode = transformSingleton(fontCode, url, lastModified);
  }

  writeFile('font.js', tplFont(fontCode, url, lastModified));

  // 只生成类型
  if (type) {
    writeFile('IconFontTypes.ts', tplTypes(iconNames));
  }

  // 只生成预览
  if (preview) {
    writeFile('preview.html', tplPreview());
  }

  if (type || preview) {
    return true;
  }

  writeFile('index.ts', tplIndex());
  writeFile('IconFontTypes.ts', tplTypes(iconNames));
  writeFile('preview.html', tplPreview());

  return true;
}

export default generator;
