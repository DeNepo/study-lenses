const jsonFormatterLense = async (simpReq, resource, config) => {
  const { relPath, ownStatic } = resource;

  resource.content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${relPath}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <script src='${ownStatic}/json-formatter.umd.js'></script>
  </head>
  <body>
    <script>
      fetch(window.location.origin + "${relPath}")
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
  resource.mime = 'text/html';


  return resource
};

module.exports = jsonFormatterLense;
