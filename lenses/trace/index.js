'use strict';

const traceLens = async ({ resource, config }) => {
  if (!resource.info && !resource.content) {
    return;
  }

  if (resource.info.ext !== '.js') {
    return;
  }

  if (typeof resource.content !== 'string') {
    return;
  }

  resource.content = `<!DOCTYPE html>
  <html>
  <head>
      <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body>
    <trace-table-button></trace-table-button>

    <pre class="language-js"><code class="language-js line-numbers">${
      resource.content
    }
</code></pre>

    <script src="${config.sharedStatic}/prism/script.js"></script>

    <script src='${config.sharedStatic}/trace/aran-build.js'></script>
    <script id="trace" async type="module" src="${
      config.sharedStatic
    }/trace/index.js"></script>

    <script>
      document.getElementById('trace')
        .addEventListener('load', () => window.trace(decodeURI("${encodeURI(
          resource.content,
        )}")));
    </script>


    <script src='${config.sharedStatic}/parsonizer/jquery.min.js'></script>
    <script src='${config.sharedStatic}/parsonizer/jquery-ui.min.js'></script>
    <script src="${
      config.sharedStatic
    }/wc-trace-table/configurable-button.js" type="module"></script>

  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = traceLens;
