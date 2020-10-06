const jsonFormatterLense = async (req, res, config) => {
  const { absPath, relPath, param, staticPrefix } = config;

  const content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${relPath}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <script src='${staticPrefix}/json-formatter.umd.js'></script>
  </head>
  <body>
    <script>
      fetch(window.location.origin + "${relPath}")
        .then(res => res.json())
        .then(json => {
          document.body.appendChild(
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
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(content, 'utf-8');

  return {
    req,
    res
  }
};

module.exports = jsonFormatterLense;
