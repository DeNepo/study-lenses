const prettier = require('prettier');

const prettierLense = async ({ resource, config }) => {

  if (!resource.info && !config.queryValue.code) {
    return
  }

  let code = resource.content
  let ext = resource.info.ext

  if (typeof config.queryValue.code === 'string') {
    code = config.queryValue.code
    ext = config.queryValue.ext || ''
  } else if (typeof resource.content !== 'string') {
    return
  }

  if (!code) {
    return
  }

  let start = 0
  let end = code.split('\n').length

  if (typeof config.queryValue.start === 'number') {
    start = config.queryValue.start
  }

  if (typeof config.queryValue.end === 'number') {
    end = config.queryValue.end
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

  try {
    resource.content = prettify(code, ext);
    resource.info.ext = ext
  } catch (err) {
    resource.error = err
  }

  return {
    resource
  };
};

module.exports = prettierLense;
