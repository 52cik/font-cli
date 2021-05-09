const date = () => {
  const dt = new Date();
  return [
    [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join('-'),
    [dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':'),
  ].join(' ').replace(/(?=\b\d\b)/g, '0');
};

const font = (code: string, url: string) => `
// @ts-nocheck
/* eslint-disable */
// @date ${date()}
// @url ${url}
${code}
`.trimStart();

export default font;
