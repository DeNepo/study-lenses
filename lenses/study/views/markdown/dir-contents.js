/* UPDATE

*/

"use strict";

const path = require("path");

const dirContents = ({ dirElement, top = false, defaults = {} }) => {
  if (dirElement.type === "file") {
    const isRe = dirElement.base.toLowerCase().includes(".re.");
    const relativePath = path.join(
      dirElement.toCwd,
      dirElement.dir,
      dirElement.base
    );
    // obfuscate .js files, minify html and CSS
    return `<li><a href="${relativePath}?${
      isRe && /.js$/i.test(dirElement.base) ? "obf&min&" : isRe ? "min&" : ""
    }--defaults" target="_blank">${dirElement.base}</a></li>\n`;
  }

  if (dirElement.type === "directory") {
    const hasSummary = dirElement.children.find(
      (child) => child.base.toLowerCase() === "summary.md"
    );
    const nameElement = hasSummary
      ? `<a href='${dirElement.base}' target='_blank'>${dirElement.base}</a>`
      : dirElement.base;
    const subIndex = Array.isArray(dirElement.children)
      ? dirElement.children
          .map((child) =>
            dirContents({
              dirElement: child,
              defaults: Object.assign(
                {},
                defaults,
                dirElement.locals["--defaults"] || {}
              ),
            })
          )
          .join("\n")
      : "";

    const relativePath = path.join(
      dirElement.toCwd,
      dirElement.dir,
      dirElement.base
    );
    return top
      ? subIndex
      : `<li><details style="margin-bottom: 0px;"><summary><a href="${relativePath}?--defaults">${nameElement}</a></summary>\n` +
          (subIndex
            ? '\n<ul style="list-style-type: none;">' + subIndex + "</ul>"
            : "") +
          "</details></li>";
  }

  return "";
};

module.exports = dirContents;
