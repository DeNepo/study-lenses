const mermaidLense = async ({ resource, config }) => {
  if (resource.info.ext !== ".mmd") {
    return;
  }

  resource.content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${resource.info.dir}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
  </head>
  <body>
    <div class="mermaid">${resource.content}</div>
    <script src='${config.sharedStatic}/mermaid/index.js'></script>
  </body>
</html>`;
  resource.info.ext = ".html";

  return {
    resource,
  };
};

module.exports = mermaidLense;
