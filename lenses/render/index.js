"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");

const writeFilePromise = util.promisify(fs.writeFile);

const marked = require("marked");

marked.setOptions({
  langPrefix: "line-numbers language-",
});

const edit = require("./edit");

const renderLense = async ({ resource, requestData, config }) => {
  if (resource.info.ext !== ".md") {
    return resource;
  }

  if (config.locals.save === true && requestData.method === "POST") {
    try {
      const absolutePath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base
      );
      await writeFilePromise(absolutePath, requestData.body.text, "utf-8");
      resource.content = ": changes were saved";
      // console.log(resource.content);
      resource.info.ext = ".txt";
      return {
        resource,
      };
    } catch (err) {
      console.log(err);
      responseData.status = 500;
      resource.content =
        "unable to save changes.  check server logs for more info";
      resource.info.ext = ".txt";
      return {
        resource,
        responseData,
      };
    }
  }

  config.content = resource.content;

  try {
    resource.content =
      config.queryValue === "edit"
        ? edit({ config, resource })
        : `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body>
    <main class="markdown-body">${marked(resource.content)}</main>
    <script src="${config.sharedStatic}/prism/script.js"></script>
    <script src="${config.sharedStatic}/prism/toolbar.js"></script>
  </body>
</html>`;
    resource.info.ext = ".html";
  } catch (err) {
    console.log(err);
  }

  return {
    resource,
  };
};

module.exports = renderLense;
