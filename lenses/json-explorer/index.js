const jsonFormatterLense = async ({ requestData, resource, config }) => {

  if (resource.info && resource.info.ext !== '.json') {
    return
  }

  resource.content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${requestData.url}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <script src='${config.sharedStatic}/json-formatter.umd.js'></script>
  </head>
  <body>
    <script>
      const json = JSON.parse(decodeURIComponent("${encodeURIComponent(typeof resource.content === 'object' && resource.content ? JSON.stringify(resource.content) : resource.content)}"))
      const renderedJson = new JSONFormatter(json, 1, {
          hoverPreviewEnabled: true,
          hoverPreviewArrayCount: 5,
          hoverPreviewFieldCount: 5,
        }).render()
      document.body.appendChild(renderedJson)
    </script>
  </body>
</html>`;
  resource.info.ext = '.html';


  return {
    resource
  }
};

module.exports = jsonFormatterLense;
