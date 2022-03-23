const Acorn = require('acorn');

const jsonFormatterLense = async ({ requestData, resource, config }) => {
  if (resource.info && resource.info.ext !== '.js') {
    return;
  }

  if (typeof config.queryValue.content === 'string') {
    resource.content = config.queryValue.content;
  }

  const ast = Acorn.parse(resource.content, { locations: true });

  if (config.queryValue === 'log') {
    resource.content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${requestData.url}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <script src="${config.sharedStatic}/prism/script.js"></script>
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">

  </head>
  <body>
    <pre><code id='code-goes-here' class="language-javascript line-numbers"></code></pre>
    <script>
      const code = JSON.parse(decodeURIComponent("${encodeURIComponent(
        JSON.stringify(resource.content),
      )}"))

      const json = JSON.parse(decodeURIComponent("${encodeURIComponent(
        JSON.stringify(ast),
      )}"))
      console.log(json);
    </script>
    <script src="${config.ownStatic}/init.js"></script>

  </body>
</html>`;
  } else {
    resource.content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${requestData.url}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <script src='${config.sharedStatic}/json-formatter.umd.js'></script>
    <script src="${config.sharedStatic}/prism/script.js"></script>
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">

  </head>
  <body>
    <div id='resize-parent' style="display: flex; flex-direction: row;">
      <div id='code-container' style='height: 90vh; width: 50vw'>
        <pre><code id='code-goes-here' class="language-javascript line-numbers"></code></pre>
      </div>
      <div id='tree-container' style='height: 90vh; width: 50vw'> </div>
    </div>
    <script>
      const code = JSON.parse(decodeURIComponent("${encodeURIComponent(
        JSON.stringify(resource.content),
      )}"))

      const json = JSON.parse(decodeURIComponent("${encodeURIComponent(
        JSON.stringify(ast),
      )}"))
      const renderedJson = new JSONFormatter(json, 1, {
          hoverPreviewEnabled: true,
          hoverPreviewArrayCount: 5,
          hoverPreviewFieldCount: 5,
        }).render()
      document.getElementById('tree-container').appendChild(renderedJson)
    </script>
    <script src="${config.ownStatic}/init.js"></script>

  </body>
</html>`;
  }

  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = jsonFormatterLense;
