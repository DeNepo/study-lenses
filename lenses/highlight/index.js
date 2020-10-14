const highlightLense = async ({ resource, config }) => {


  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <pre><code class="language-${resource.info.ext.split('.').join('')}">${resource.content}</code></pre>
    <script src="${config.sharedStatic}/prism/script.js"></script>
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource
  };
};

module.exports = highlightLense;
