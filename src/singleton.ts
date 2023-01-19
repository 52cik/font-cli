import {
  parse,
  traverse,
  template,
  types,
  transformFromAstSync,
  NodePath,
} from '@babel/core';

/** 添加版本变量 */
const addIdAndVersion = (path: NodePath<types.Identifier>, id: string, version: string) => {
  if (path.isIdentifier({ name: 'window' }) && path.parentPath.isCallExpression()) {
    const parentNode = path.parentPath.node;
    const parentNodeCallee: types.FunctionExpression = parentNode.callee as any;
    parentNode.arguments.push(types.stringLiteral(id));
    parentNode.arguments.push(types.stringLiteral(version));
    parentNodeCallee.params.push(types.identifier('id'));
    parentNodeCallee.params.push(types.identifier('version'));
    path.skip();
    path.parentPath.skip();
  }
};

/** 添加版本属性 */
const addSvgAttribute = (path: NodePath<types.Identifier>) => {
  if (!path.isIdentifier({ name: 'setAttribute' })) return;

  const parentPath = path.findParent((p) => p.isCallExpression());

  if (!parentPath) return;

  const objectName = (path.parent as any).object.name;

  parentPath.replaceWithSourceString([
    `${objectName}.setAttribute("aria-hidden", "true")`,
    `${objectName}.setAttribute("data-id", id)`,
    `${objectName}.setAttribute("data-version", version)`,
  ].join(','));

  parentPath.skip();
};

/** 版本检查 */
const addVersionChecker = (path: NodePath<types.Identifier>) => {
  if (path.isIdentifier({ name: 'innerHTML' })) {
    const parentPath = path.findParent((p) => p.isBlockStatement());
    if (!parentPath?.isBlockStatement()) return;
    parentPath.node.body.unshift(template.statement('if(((svgo||0).dataset||0).version >= version)return;')());
    parentPath.node.body.unshift(template.statement('var svgo = document.querySelector(\'[data-id="\' + id + \'"]\');')());
    path.skip();
  }
};

/** 替换老图标 */
const replaceNode = (path: NodePath<types.Identifier>, code: string) => {
  if (path.isIdentifier({ name: 'appendChild' })) {
    const parentPath = path.findParent((p) => p.isConditionalExpression());
    const parentCall = path.findParent((p) => p.isCallExpression());
    if (!parentPath || !parentCall) return;

    const nodeName = (parentCall.node as any).arguments[0].name;
    const newNode = template.ast([
      `svgo ? svgo.parentElement.replaceChild(${nodeName}, svgo) :`,
      code.slice(parentPath.node.start || 0, parentPath.node.end || 0),
    ].join('')) as types.Statement;

    parentPath.replaceWith(newNode);
    parentPath.skip();
  }
};

/**
 * 转单例
 * @param code 代码
 * @param url 地址
 * @param date 字体创建日期
 */
const transformSingleton = (code: string, url: string, date: string | number) => {
  const res = [
    // /!function\(\w+\)\{/,
    /\(window\)/,
    /\w+.setAttribute\("aria-hidden","true"\)/,
    /document.createElement\("div"\)/,
    /\w+.appendChild\(\w+\)/,
  ];

  if (res.some((re) => !re.test(code))) {
    throw Error('字体文件代码格式不兼容');
  }

  const id = (url.match(/font_([^_]+)/) || [])[1];
  const version = `${Math.floor(new Date(date).getTime() / 1000)}`;
  const ast = parse(code);

  if (!id) {
    throw Error('无效的URL');
  }

  if (!ast) {
    throw Error('code 解析错误');
  }

  traverse(ast, {
    Identifier(path) {
      // 添加版本变量
      addIdAndVersion(path, id, version);
      // 添加版本属性
      addSvgAttribute(path);
      // 版本检测
      addVersionChecker(path);
      // 替换老图标
      replaceNode(path, code);
    },
  });

  const output = transformFromAstSync(ast, code, { minified: true });

  if (!output) {
    throw Error('code 转换错误');
  }

  return output.code || '';
};

export default transformSingleton;
