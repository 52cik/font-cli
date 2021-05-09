import fs from 'fs';
import { resolve } from 'path';
import mkdirp from 'mkdirp';
import got from 'got';
import tplFont from './tpl-font';
import tplIndex from './tpl-index';
import tplTypes from './tpl-types';
import tplPreview from './tpl-preview';

interface GeneratorOptions {
  url: string;
  out: string;
  type: boolean;
  preview: boolean;
  prune: string;
}

async function generator(options: GeneratorOptions) {
  const {
    url,
    out,
    type,
    preview,
    prune,
  } = options;

  if (!/font_\w+_\w+\.js\b/.test(url)) {
    throw Error('无效的URL!');
  }

  const IconFontPath = (name: string) => resolve(process.cwd(), out, name);
  const fontUrl = url.replace(/^(?=\/\/)/, 'https:');
  let { body } = await got(fontUrl, { timeout: 10 * 1000 });

  if (prune || prune === '') {
    const [prefix, newPrefix] = (prune || 'icon-').split('=');
    body = body.replace(RegExp(`id="${prefix}`, 'g'), `id="${newPrefix || ''}`);
  }

  const iconNames: string[] = body.match(/[^"]+(?=" viewBox)/g) || [];

  if (!fs.existsSync(IconFontPath('.'))) {
    mkdirp.sync(IconFontPath('.'));
  }

  fs.writeFileSync(IconFontPath('font.js'), tplFont(body, url), 'utf8');

  // 只生成类型
  if (type) {
    fs.writeFileSync(IconFontPath('IconFontTypes.ts'), tplTypes(iconNames), 'utf8');
  }

  // 只生成预览
  if (preview) {
    fs.writeFileSync(IconFontPath('preview.html'), tplPreview(), 'utf8');
  }

  if (type || preview) {
    return true;
  }

  // fs.writeFileSync(IconFontPath('font.js'), tplFont(body, url), 'utf8');
  fs.writeFileSync(IconFontPath('index.ts'), tplIndex(), 'utf8');
  fs.writeFileSync(IconFontPath('IconFontTypes.ts'), tplTypes(iconNames), 'utf8');
  fs.writeFileSync(IconFontPath('preview.html'), tplPreview(), 'utf8');

  return true;
}

export default generator;
