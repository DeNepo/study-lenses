"use strict";

const pseudofy = require("./pseudofy");

const pseudoLens = async ({ resource, config }) => {
  if (resource.info.ext !== ".js") {
    return;
  }

  if (config.queryValue === "js") {
    resource.content = pseudofy(resource.content, true);
  } else {
    resource.info.ext = ".pseudo.txt";
    resource.content = pseudofy(resource.content);
  }

  return {
    resource,
  };
};

module.exports = pseudoLens;
