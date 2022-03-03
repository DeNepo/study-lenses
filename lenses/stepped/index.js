"use strict";

const path = require("path");

const fs = require("fs");
const util = require("util");
const writeFilePromise = util.promisify(fs.writeFile);
const mkdirPromise = util.promisify(fs.mkdir);

const renderDir = require("./render-directory");
const renderStepped = require("./render-stepped");
const isStepped = require("./lib/is-stepped");

// const isStepped = require("./lib/is-stepped.js");

const steppedLens = async (arg = {}) => {
  const { resource, config, requestData, lenses } = arg;

  if (config.locals.save === true && requestData.method === "POST") {
    try {
      const absolutePath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base,
        requestData.body.fileName
      );

      const stepsPath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base
      );

      if (!fs.existsSync(stepsPath)) {
        await mkdirPromise(stepsPath);
      }

      await writeFilePromise(absolutePath, requestData.body.text, "utf-8");
      resource.content = ": changes were saved";
      // console.log(resource.content);
      resource.info.ext = ".txt";
      return { resource };
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
    const studyLens = lenses.find((lens) => lens.queryKey === "study");
    if (studyLens) {
      return await studyLens.module({ ...arg, config: studyLens });
    } else {
      return;
    }
  }

  resource.info.ext = ".html";

  if (config.locals.root === resource.info.base) {
    resource.content = renderDir(resource, config);
    return { resource };
  }

  resource.content = isStepped(resource)
    ? await renderStepped(resource, config)
    : renderDir(resource, config);

  return { resource };
};

module.exports = steppedLens;
