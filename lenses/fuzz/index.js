"use strict";

const renderDir = require("./render-directory");
const renderFuzzercise = require("./render-fuzzercise");

const isFuzzercise = (resource) =>
  resource.info.type === "directory" &&
  resource.content &&
  resource.content.children.find(
    (child) => child.base.toLowerCase() === "fuzz.js"
  )
    ? true
    : false;

const fuzzLens = async ({ resource, config }) => {
  if (resource.info.type !== "directory" || resource.content === null) {
    return;
  }

  resource.info.ext = ".html";
  resource.content = isFuzzercise(resource)
    ? await renderFuzzercise(resource, config)
    : renderDir(resource, config);

  return { resource };
};

module.exports = fuzzLens;
