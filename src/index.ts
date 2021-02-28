import fs from 'fs';
import path from 'path';
import got from 'got';
import font from './tpl-font';
import index from './tpl-index';
import types from './tpl-types';
import preview from './tpl-preview';

const IconFontPath = (name: string) => path.resolve(process.cwd(), 'IconFont', name);

async function generator(url: string) {
  const fontUrl = url.replace(/^(?=\/\/)/, 'https:');
  const { body } = await got(fontUrl);
  const iconNames: string[] = body.match(/[^"]+(?=" viewBox)/g) || [];

  if (!fs.existsSync(IconFontPath('.'))) {
    fs.mkdirSync(IconFontPath('.'));
  }

  fs.writeFileSync(IconFontPath('font.js'), font(body, url), 'utf8');
  fs.writeFileSync(IconFontPath('index.ts'), index(), 'utf8');
  fs.writeFileSync(IconFontPath('IconFontTypes.ts'), types(iconNames), 'utf8');
  fs.writeFileSync(IconFontPath('preview.html'), preview(iconNames), 'utf8');
}

export default generator;
