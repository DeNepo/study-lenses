

const highlightLense = async ({ resource, config }) => {

  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <pre><code id='code-goes-here' class="language-${typeof resource.content === 'object' ? 'json' : resource.info.ext.split('.').join('')}"></code></pre>
    <script src="${config.sharedStatic}/prism/script.js"></script>
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">

    <script>
      const code = "${encodeURIComponent(typeof resource.content === 'object' ? JSON.stringify(resource.content, null, '  ') : resource.content)}"
    </script>
    <script src='${config.ownStatic}/init.js'></script>
  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource
  };
};

module.exports = highlightLense;
