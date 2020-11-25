const marked = require('marked');

marked.setOptions({
  langPrefix: 'line-numbers language-'
})

const renderLense = async ({ resource, config }) => {

  if (resource.info.ext !== '.md') {
    return resource;
  }

  try {
    resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body>
    <main class="markdown-body">${marked(resource.content)}</main>
    <script src="${config.sharedStatic}/prism/script.js"></script>
    <script src="${config.sharedStatic}/prism/toolbar.js"></script>
  </body>
</html>`;
    resource.info.ext = '.html';
  } catch (err) {
    console.log(err);
  }

  return {
    resource
  };
};

module.exports = renderLense;
