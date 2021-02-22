"use strict";

const marked = require("marked");

// const plugins = require("./load-plugin-guides.js");

const renderMainGuide = async ({ config, lenses, options }) => {
  const plugins = { lenses, options };
  const isOption = config.queryValue.startsWith("--");

  let pluginDocs = "";
  if (isOption) {
    const thePlugin = plugins.options.find(
      (option) => option.queryKey === config.queryValue
    );
    pluginDocs = thePlugin ? thePlugin.docs : "";
  } else {
    const thePlugin = plugins.lenses.find(
      (lens) => lens.queryKey === config.queryValue
    );
    pluginDocs = thePlugin ? thePlugin.docs : "";
  }

  if (!pluginDocs) {
    pluginDocs =
      "404: there is no " +
      (isOption ? "option" : "lens") +
      " ```?" +
      config.queryValue +
      "```, or it does not have any docs";
  }
  return `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body class="markdown-body">
    ${marked(pluginDocs)}
    <script src="${config.sharedStatic}/prism/script.js"></script>
  </body>
</html>`;
};

module.exports = renderMainGuide;
