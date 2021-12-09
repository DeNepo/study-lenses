const correctChildren = (children = []) =>
  Array.isArray(children) &&
  children.every((child) => child.ext === ".js" || child.ext === ".md");

const isStepped = (resource) =>
  ((resource.info && resource.info.type === "directory") ||
    resource.type === "directory") &&
  resource.content
    ? correctChildren(resource.content.children)
    : correctChildren(resource.children)
    ? true
    : false;

module.exports = isStepped;
