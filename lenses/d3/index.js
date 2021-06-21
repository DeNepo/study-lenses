"use strict";

const d3Lens = ({ resource, config }) => {
  if (!resource.info && !resource.info.ext === ".js") {
    return;
  }

  resource.info.ext = ".html";
  resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <script src='${config.sharedStatic}/d3.min.js'></script>
  </head>
  <body>
    <script>${resource.content}</script>
  </body>
</html>`;

  return { resource };
};

module.exports = d3Lens;
