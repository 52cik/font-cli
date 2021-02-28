import fs from 'fs';
import path from 'path';
import got from 'got';
import types from './tpl-types';
import index from './tpl-index';
import preview from './tpl-preview';

const IconFontPath = (name: string) => path.resolve(process.cwd(), 'IconFont', name);

async function font(url: string) {
  const fontUrl = url.replace(/^(?=\/\/)/, 'https:');
  const { body } = await got(fontUrl);
  const code = `// @ts-nocheck\n/* eslint-disable */\n${body}`;
  const iconNames: string[] = body.match(/[^"]+(?=" viewBox)/g) || [];

  if (!fs.existsSync(IconFontPath('.'))) {
    fs.mkdirSync(IconFontPath('.'));
  }

  fs.writeFileSync(IconFontPath('font.js'), code, 'utf8');
  fs.writeFileSync(IconFontPath('index.ts'), index(), 'utf8');
  fs.writeFileSync(IconFontPath('IconFontTypes.ts'), types(iconNames), 'utf8');
  fs.writeFileSync(IconFontPath('preview.html'), preview(iconNames), 'utf8');
}

export default font;
