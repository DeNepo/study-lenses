"use strict";

const fs = require("fs");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

const path = require("path");

const marked = require("marked");

const renderMainGuide = async ({ config, resource, lenses, options }) => {
  const plugins = { lenses, options };

  let optionUserGuides = "";
  for (const plugin of plugins.options) {
    if (plugin.userGuide) {
      const guideLink = `<a href="./?--help=${plugin.queryKey}" target="_blank">?${plugin.queryKey}</a>`;
      optionUserGuides += "<li>" + guideLink + "</li>";
    }
  }

  let lensUserGuides = "";
  for (const plugin of plugins.lenses) {
    if (plugin.userGuide) {
      const guideLink = `<a href="./?--help=${plugin.queryKey}" target="_blank">?${plugin.queryKey}</a>`;
      lensUserGuides += "<li>" + guideLink + "</li>";
    }
  }

  const listify = (html, kind) =>
    `<details><summary>all ${kind} guides</summary><br><ul>${html}</ul></details>`;

  let userGuide = await readFilePromise(
    path.join(__dirname, "..", "..", "user-guide.md"),
    "utf-8"
  );

  const lensesRegex = /(<!--[ \t]*begin[ \t]*lenses[ \t]*-->)([\s\S]*)(<!--[ \t]*end[ \t]*lenses[ \t]*-->)/gim;
  const optionsRegex = /(<!--[ \t]*begin[ \t]*options[ \t]*-->)([\s\S]*)(<!--[ \t]*end[ \t]*options[ \t]*-->)/gim;

  userGuide = userGuide.replace(
    lensesRegex,
    `<!-- BEGIN LENSES -->\n${listify(
      lensUserGuides,
      "lens"
    )}\n<!-- END LENSES -->`
  );

  userGuide = userGuide.replace(
    optionsRegex,
    `<!-- BEGIN OPTIONS -->\n${listify(
      optionUserGuides,
      "option"
    )}\n<!-- END OPTIONS -->`
  );

  return `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body class="markdown-body">
    <a href='${
      resource.info.toCwd
    }?--defaults'><code>/?--defaults</code>: back to main directory</a>
    <hr>
    ${marked(userGuide)}
    <hr>
    <script src="${config.sharedStatic}/prism/script.js"></script>
  </body>
</html>`;
};

module.exports = renderMainGuide;
