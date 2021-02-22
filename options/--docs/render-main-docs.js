"use strict";

const fs = require("fs");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

const path = require("path");

const marked = require("marked");

const renderMainGuide = async ({ config, resource, lenses, options }) => {
  const plugins = { lenses, options };

  let optionDocss = "";
  for (const plugin of plugins.options) {
    if (plugin.docs) {
      const guideLink = `<a href="./?--docs=${plugin.queryKey}" target="_blank">?${plugin.queryKey}</a>`;
      optionDocss += "<li>" + guideLink + "</li>";
    }
  }

  let lensDocss = "";
  for (const plugin of plugins.lenses) {
    if (plugin.docs) {
      const guideLink = `<a href="./?--docs=${plugin.queryKey}" target="_blank">?${plugin.queryKey}</a>`;
      lensDocss += "<li>" + guideLink + "</li>";
    }
  }

  const listify = (html, kind) =>
    `<details><summary>all ${kind} docs</summary><br><ul>${html}</ul></details>`;

  let docs = await readFilePromise(
    path.join(__dirname, "..", "..", "docs.md"),
    "utf-8"
  );

  const lensesRegex = /(<!--[ \t]*begin[ \t]*lenses[ \t]*-->)([\s\S]*)(<!--[ \t]*end[ \t]*lenses[ \t]*-->)/gim;
  const optionsRegex = /(<!--[ \t]*begin[ \t]*options[ \t]*-->)([\s\S]*)(<!--[ \t]*end[ \t]*options[ \t]*-->)/gim;

  docs = docs.replace(
    lensesRegex,
    `<!-- BEGIN LENSES -->\n${listify(lensDocss, "lens")}\n<!-- END LENSES -->`
  );

  docs = docs.replace(
    optionsRegex,
    `<!-- BEGIN OPTIONS -->\n${listify(
      optionDocss,
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
    ${marked(docs)}
    <hr>
    <script src="${config.sharedStatic}/prism/script.js"></script>
  </body>
</html>`;
};

module.exports = renderMainGuide;
