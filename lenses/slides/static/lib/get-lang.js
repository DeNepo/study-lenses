export const getLang = (node) =>
  Array.from(node.children[0].classList)
    .filter((className) => className !== 'hljs' && className !== 'remark-code')
    .sort()[0];
