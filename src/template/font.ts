const date = (time?: number | string) => {
  const dt = new Date(time || Date.now());
  return [
    [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join('-'),
    [dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':'),
  ].join(' ').replace(/(?=\b\d\b)/g, '0');
};

const font = (code: string, url: string, time: number | string) => `
// @ts-nocheck
/* eslint-disable */
// @last-modified ${date(time)}
// @url ${url}
${code}
`.trimStart();

export default font;
