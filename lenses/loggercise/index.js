"use strict";

const path = require("path");

const fs = require("fs");
const util = require("util");
const writeFilePromise = util.promisify(fs.writeFile);
const mkdirPromise = util.promisify(fs.mkdir);

const renderDir = require("./render-directory");
const renderLoggercise = require("./render-loggercise");

const isLoggercise = (resource) =>
  resource.info.type === "directory" &&
  resource.content &&
  resource.content.children.find(
    (child) => child.base.toLowerCase() === "expected-logs.js"
  )
    ? true
    : false;

const loggerciseLens = async ({ resource, config, requestData }) => {
  if (config.locals.save === true && requestData.method === "POST") {
    try {
      const absolutePath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base,
        "solutions",
        requestData.body.fileName
      );

      const solutionsPath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base,
        "solutions"
      );

      if (!fs.existsSync(solutionsPath)) {
        await mkdirPromise(solutionsPath);
      }

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

  if (resource.info.type !== "directory" || resource.content === null) {
    return;
  }

  resource.info.ext = ".html";
  resource.content = isLoggercise(resource)
    ? await renderLoggercise(resource, config)
    : renderDir(resource, config);

  return { resource };
};

module.exports = loggerciseLens;
