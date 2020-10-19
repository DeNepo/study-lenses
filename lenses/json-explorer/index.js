const jsonFormatterLense = async ({ requestData, resource, config }) => {

  console.log(resource)

  if (resource.info && resource.info.ext !== '.json') {
    return
  }

  resource.content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${requestData.url}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <script src='${config.ownStatic}/json-formatter.umd.js'></script>
  </head>
  <body>
    <script>
      fetch(window.location.origin + "${requestData.path}")
        .then(res => res.json())
        .then(json => {
          document.body.appendChild(
            // this could be configged by url param
            (new JSONFormatter(json, 1, {
              hoverPreviewEnabled: true,
              hoverPreviewArrayCount: 5,
              hoverPreviewFieldCount: 5,
            }))
              .render()
          );
        })
        .catch(err => console.error(err));
    </script>
  </body>
</html>`;
  resource.info.ext = '.html';


  return {
    resource
  }
};

module.exports = jsonFormatterLense;
