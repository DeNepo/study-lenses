const isStepped = (resource, ext = ".js") => {
  const correctChildren = (children = []) =>
    Array.isArray(children) && children.some((child) => child.ext === ext);

  const itIs =
    resource.info &&
    (resource.info.type === "directory" || resource.type === "directory") &&
    (resource.content
      ? correctChildren(resource.content.children)
      : correctChildren(resource.children));

  return itIs;
};

module.exports = isStepped;
