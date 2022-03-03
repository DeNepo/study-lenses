const isStepped = (resource = {}, ext = ".js") => {
  const containsTargetExtension = (children = []) =>
    Array.isArray(children) && children.some((child) => child.ext === ext);

  const itIs = resource.children
    ? containsTargetExtension(resource.children)
    : resource.content
    ? containsTargetExtension(resource.content.children)
    : false;

  return itIs;
};

module.exports = isStepped;
