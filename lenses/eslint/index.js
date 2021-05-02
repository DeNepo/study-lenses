"use strict";

const { ESLint } = require("eslint");

const eslint = new ESLint();

const eslintLens = async ({ config, resource }) => {
  if (resource.info.ext !== ".js") {
    return;
  }

  const codeToLint = resource.content;

  resource.info.ext = ".txt";
  try {
    // 2. Lint files.
    const results = await eslint.lintText(codeToLint);

    // 3. Format the results.
    const formatter = await eslint.loadFormatter("codeframe");
    const resultText = formatter.format(results);

    // https://stackoverflow.com/a/29497680
    resource.content = resultText.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );
  } catch (err) {
    resource.content = err.message;
  }

  return { resource };
};

module.exports = eslintLens;
