"use strict";

const marked = require("marked");

// const plugins = require("./load-plugin-guides.js");

const renderMainGuide = async ({ config, lenses, options }) => {
  const plugins = { lenses, options };
  const isOption = config.queryValue.startsWith("--");

  let pluginUserGuide = "";
  if (isOption) {
    const thePlugin = plugins.options.find(
      (option) => option.queryKey === config.queryValue
    );
    pluginUserGuide = thePlugin ? thePlugin.userGuide : "";
  } else {
    const thePlugin = plugins.lenses.find(
      (lens) => lens.queryKey === config.queryValue
    );
    pluginUserGuide = thePlugin ? thePlugin.userGuide : "";
  }

  if (!pluginUserGuide) {
    pluginUserGuide =
      "404: there is no " +
      (isOption ? "option" : "lens") +
      " ```?" +
      config.queryValue +
      "```, or it does not have a user guide";
  }
  return `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body class="markdown-body">
    ${marked(pluginUserGuide)}
    <script src="${config.sharedStatic}/prism/script.js"></script>
  </body>
</html>`;
};

module.exports = renderMainGuide;
