"use strict";

const path = require("path");
const fs = require("fs");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

const staticLens = async ({ resource }) => {
  if (resource.info.type !== "directory") {
    return;
  }

  const indexHtmlPath = path.join(
    resource.info.root,
    resource.info.dir,
    resource.info.base,
    "index.html"
  );
  console.log(indexHtmlPath);
  const indexHtmlExists = fs.existsSync(indexHtmlPath);

  console.log(indexHtmlExists);
  if (indexHtmlExists) {
    const indexHtml = await readFilePromise(indexHtmlPath, "utf-8");

    resource.content = indexHtml;
    resource.info.ext = ".html";

    return { resource };
  }
};

module.exports = staticLens;
