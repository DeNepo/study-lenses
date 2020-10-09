

const mermaidLense = async (simpReq, resource, config) => {
  const { relPath, sharedStatic, content } = resource;

  resource.content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${relPath}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
  </head>
  <body>
    <div class="mermaid">${resource}</div>
    <script src='${sharedStatic}/mermaid/index.js'></script>
  </body>
</html>`;
  resource.mime = 'text/html';

  return resource
};

module.exports = mermaidLense;
