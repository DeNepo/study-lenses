const path = require('path');

const prismLense = async (simpReq, resource, config) => {
  const { absPath } = resource;
  const extension = path.extname(absPath).replace('.', '');

  resource.mime = 'text/html';
  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <pre><code class="language-${extension}">${resource.content}</code></pre>
    <script src="${config.sharedStatic}/prism/script.js"></script>
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </body>
</html>`;

  return resource;
};

module.exports = prismLense;
