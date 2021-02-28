const font = (code: string, url: string) => `
// @ts-nocheck
/* eslint-disable */
// @url ${url}
${code}
`.trimStart();

export default font;
