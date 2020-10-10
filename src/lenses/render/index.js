const path = require('path');
const marked = require('marked');

const renderLense = async (simpReq, resource, config) => {
  const { absPath } = resource;

  if (path.extname(absPath) !== '.md') {
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
  </body>
</html>`;
    resource.mime = 'text/html';
    resource.absPath = resource.absPath.replace('.md', '.html')
    resource.relPath = resource.relPath.replace('.md', '.html')
  } catch (err) {
    console.log(err);
  }

  return resource;
};

module.exports = renderLense;
