"use strict";

/*
  if folder contains none of stepped type
    render as ?study directory
  if it does render as that type
    extend buttons to include steppedness
*/

const DirectorySSR = require("../directory");

const SteppedCodeSSR = require("./code");
const SteppedJavaScriptSSR = require("./javascript");
const SteppedHtmlSSR = require("./html");

const isStepped = require("./lib/is-stepped");

const SteppedSSR = class {
  constructor({ config, resource, requestData }) {
    const paramExt =
      config.queryValue.includes("stepped") &&
      config.queryValue.split(" ").filter((param) => param !== "stepped")[0];

    const localExt =
      typeof config.locals.stepped === "string" ? config.locals.stepped : "";

    const preExt = paramExt || localExt || ".js";
    const stepsExt = (
      preExt.startsWith(".") ? preExt : `.${preExt}`
    ).toLowerCase();

    if (!isStepped(resource, stepsExt)) {
      return new DirectorySSR({ config, resource, requestData });
    }

    config.stepsExt = stepsExt;

    return stepsExt === ".js"
      ? new SteppedJavaScriptSSR({ config, resource })
      : stepsExt === ".html"
      ? new SteppedHtmlSSR({ config, resource })
      : new SteppedCodeSSR({ config, resource, stepsExt });
  }
};

module.exports = SteppedSSR;
