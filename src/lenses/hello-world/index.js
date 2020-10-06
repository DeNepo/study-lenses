const renderPath = require('local-modules').renderPath;

const helloWorldLense = async (req, res, config) => {
  const { absPath, relPath, param, staticPrefix } = config;

  const renderedPath = await renderPath(absPath);
  console.log(renderedPath)
  const content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <pre>
relPath: ${relPath}
param: ${param}
mime: ${renderedPath.mime.type}
    </pre>
    <textarea>${renderedPath.content}</textarea>
  </body>
  <script src="${staticPrefix}/static/script.js"></script>
  <link rel="stylesheet" href="${staticPrefix}/static/style.css">
</html>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(content, 'utf-8');

  return {
    req,
    res
  }
};

module.exports = helloWorldLense;
