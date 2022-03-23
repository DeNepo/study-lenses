'use strict';

// https://stackoverflow.com/questions/60694121/use-an-es-module-package-in-a-commonjs-project
let countThings = null;

const corpusLens = async ({ resource, config }) => {
  if (!countThings) {
    countThings = (await import('./count-things/index.mjs')).countThings;
  }

  if (!(resource.info.ext === '.js' || resource.info.type === 'directory')) {
    return;
  }

  const renderedAnalysis = await countThings({
    path: resource.path,
    render: true,
    resource,
  });

  resource.content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>corpus analysis</title>

      <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
      <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
    </head>
    <body>
      <div class="markdown-body">
        <ul style="list-style-type: none;">
          ${renderedAnalysis}
        </ul>
      </div>

      <script src="${config.sharedStatic}/prism/script.js"></script>
    </body>
    </html>`;

  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = corpusLens;
