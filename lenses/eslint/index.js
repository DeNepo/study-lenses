"use strict";

const path = require("path");

const { ESLint } = require("eslint");

const eslintLens = async ({ config, resource, requestData }) => {
  if (resource.info.ext !== ".js") {
    return;
  }

  const codeToLint = resource.content;

  resource.info.ext = ".txt";

  const resourceDirectory = path.dirname(
    path.join(process.cwd(), requestData.path)
  );
  try {
    const eslint = new ESLint({
      cwd: resourceDirectory,
    });

    // 2. Lint files.
    const results = await eslint.lintText(codeToLint);

    // 3. Format the results.
    const formatter = await eslint.loadFormatter("codeframe");
    const resultText = formatter.format(results);

    // https://stackoverflow.com/a/29497680
    resource.content = resultText
      ? resultText.replace(
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
          ""
        )
      : "eslint: all good!";
  } catch (err) {
    resource.content = err.message;
  }

  return { resource };
};

module.exports = eslintLens;
