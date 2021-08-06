const types = (names: string[]) => `
export type IconFontTypes =
${names.map((it) => `  | '${it}'`).join('\n')};
`.trimStart();

export default types;
