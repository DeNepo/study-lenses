'use strict';

const path = require('path');

const { ESLint } = require('eslint');

const eslintLens = async ({ config, resource, requestData }) => {
  if (resource.info.ext !== '.js') {
    return;
  }

  let lintResult = '';
  try {
    const resourcePath = path.normalize(
      path.join(process.cwd(), requestData.path),
    );

    const eslint = new ESLint({
      cwd: path.join(resourcePath, '..'),
    });

    // 2. Lint files.
    const results = await eslint.lintText(resource.content, {
      filePath: resourcePath,
    });

    // 3. Format the results.
    const formatter = await eslint.loadFormatter('codeframe');
    const resultText = formatter.format(results);

    // https://stackoverflow.com/a/29497680
    lintResult = resultText
      ? resultText.replace(
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
          '',
        )
      : 'eslint: all good!';
  } catch (err) {
    lintResult = err.message;
  }

  if (config.queryValue === 'log') {
    resource.info.ext = '.html';
    resource.content = `<!DOCTYPE html>
  <html>
  <head>
      <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body>
    <ask-me></ask-me>

    <pre id="the-code" class="language-js"><code class="language-js line-numbers">${
      resource.content
    }
</code></pre>


    <script src="${config.sharedStatic}/prism/script.js"></script>

    <script>
      console.log(decodeURI("${encodeURI(lintResult)}"))
    </script>

  </body>
</html>`;
  } else {
    resource.info.ext = '.txt';
    resource.content = lintResult;
  }

  return { resource };
};

module.exports = eslintLens;
