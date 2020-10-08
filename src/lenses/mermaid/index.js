const renderPath = require('local-modules').renderPath;

const mermaidLense = async (req, res, config) => {
  const { absPath, relPath, param, static } = config;

  const renderedPath = await renderPath(absPath);

  const content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${relPath}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
  </head>
  <body>
    <div class="mermaid">${renderedPath.content}</div>
    <script src='${static}/mermaid.js'></script>
  </body>
</html>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(content, 'utf-8');

  return {
    req,
    res
  }
};

module.exports = mermaidLense;
