export const fileOrSnippet = (node) =>
  node.parentElement.children.length === 2 ? 'file' : 'snippet';
