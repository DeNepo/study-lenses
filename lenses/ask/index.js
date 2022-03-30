'use strict';

const askLens = async ({ resource, config }) => {
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
      <link rel="stylesheet" href="${config.ownStatic}/style.css">
  </head>
  <body>
    <ask-me alert class="studyable"></ask-me>

    <pre id="the-code" class="language-js"><code class="language-js line-numbers">${resource.content}
</code></pre>

    <script>
      const code = document.getElementById('the-code').innerText;
      const editor = {
        getValue: () => code,
        getSelection: () => ({
          startLineNumber: 0,
          endLineNumber: 0,
          startColumn: 0,
          endColumn: 0
        })
      };
    </script>

    <script src="${config.sharedStatic}/prism/script.js"></script>

    <script src='${config.sharedStatic}/trace/aran-build.js'></script>
    <script src='${config.sharedStatic}/ask/component/ask-me.js' type='module'></script>

  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = askLens;
