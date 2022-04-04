'use strict';

const runLens = async ({ resource, config, requestData }) => {
  if (!resource.info && !resource.content) {
    return;
  }

  if (resource.info.ext !== '.js') {
    return;
  }

  if (typeof resource.content !== 'string') {
    return;
  }

  const tests =
    (config.queryValue && /tests/i.test(config.queryValue)) ||
    requestData.path.includes('.spec.js') ||
    requestData.path.includes('.test.js');

  const debug = config.queryValue && /debug/i.test(config.queryValue);

  const scriptTag =
    config.queryValue && /module/i.test(config.queryValue)
      ? `<script type="module">${debug ? '\ndebugger;\n\n\n' : '\n\n'}${
          resource.content
        }${debug ? '\n\ndebugger;\n' : '\n\n'}    </script>`
      : `<script>${debug ? '\ndebugger;\n\n\n' : '\n\n'}${resource.content}${
          debug ? '\n\n\ndebugger;\n' : '\n\n'
        }   </script>`;

  resource.content = `<!DOCTYPE html>
  <html>
  <head>
      <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body>
    <pre class="language-js"><code class="language-js line-numbers">${
      resource.content
    }
</code></pre>

    <script src="${config.sharedStatic}/prism/script.js"></script>


    ${
      tests
        ? `<!-- set up environment for testing -->
    <script src='${config.sharedStatic}/testing/describe-it.js'> </script>
    <script> describeItify(window); </script>
    <script src='${config.sharedStatic}/testing/jest-matchers.js'> </script>
`
        : ''
    }
    ${scriptTag}
  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = runLens;
