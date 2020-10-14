const prettier = require('prettier');

const prettierLense = async ({ resource }) => {

  if (typeof resource.content !== 'string') {
    return
  }

  const prettify = (source, mime) =>
    mime === '.js'
      ? prettier.format(source, { parser: "babel" })
      : mime === '.css'
        ? prettier.format(source, { parser: "css" })
        : mime === '.html'
          ? prettier.format(source, { parser: "html" })
          : mime === '.md'
            ? prettier.format(source, { parser: "markdown" })
            : source;

  resource.content = prettify(resource.content, resource.info.ext);

  return {
    resource
  };
};

module.exports = prettierLense;
