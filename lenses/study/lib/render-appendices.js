"use strict";

const path = require("path");
const fs = require("fs");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

const renderAppendices = async (appendices, requestPath) => {
  if (!Array.isArray(appendices)) {
    return "";
  }

  let renderedAppendices = "";
  for (const appendicy of appendices) {
    const appendicyPath =
      appendicy.relative === true
        ? path.join(
            path.dirname(path.join(process.cwd(), requestPath)),
            appendicy.path
          )
        : typeof appendicy.path === "string"
        ? path.join(process.cwd(), appendicy.path)
        : path.join(process.cwd(), appendicy);

    try {
      const nextAppendicy = await readFilePromise(appendicyPath);
      renderedAppendices += `\n\n\n// ${path.basename(
        appendicyPath
      )}\n\n${nextAppendicy}`;
    } catch (err) {
      console.error(err);
    }
  }

  return renderedAppendices;
};

module.exports = renderAppendices;
