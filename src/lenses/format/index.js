const fs = require('fs');
const prettier = require('prettier');

const prettierLense = async (simpReq, resource, config) => {
  const { absPath } = resource;

  if (fs.existsSync(absPath) && fs.lstatSync(absPath).isDirectory()) {
    return resource
  }

  const prettify = (source, mime) =>
    mime === 'application/javascript'
      ? prettier.format(source, { parser: "babel" })
      : mime === 'text/css'
        ? prettier.format(source, { parser: "css" })
        : mime === 'text/html'
          ? prettier.format(source, { parser: "html" })
          : mime === 'text/markdown'
            ? prettier.format(source, { parser: "markdown" })
            : mime === 'application/json'
              ? prettier.format(source, { parser: "markdown" })
              : source;

  resource.content = prettify(resource.content, resource.mime);

  return resource;
};

module.exports = prettierLense;
