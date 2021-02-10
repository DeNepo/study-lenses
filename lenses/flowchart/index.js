"use strict";

const { convertCodeToSvg } = require("js2flowchart");

const flowchartLense = async ({ responseData, resource, config }) => {
  if (!resource.info && !config.queryValue.code) {
    return;
  }
  // console.log(resource);

  let code = resource.content;
  let ext = resource.info.ext;

  if (typeof config.queryValue.code === "string") {
    code = config.queryValue.code;
    ext = config.queryValue.ext || "";
  } else if (typeof resource.content !== "string") {
    return;
  }

  if (ext !== ".js") {
    return;
  }

  if (!code) {
    return;
  }

  let start = 0;
  let end = code.split("\n").length;

  if (typeof config.queryValue.start === "number") {
    start = config.queryValue.start;
  }

  if (typeof config.queryValue.end === "number") {
    end = config.queryValue.end;
  }

  code = code
    .split("\n")
    .slice(start, end + 1)
    .join("\n");

  try {
    resource.content = convertCodeToSvg(code);
    resource.info.ext = ".svg";
  } catch (err) {
    resource.content =
      err.name +
      ": " +
      err.message +
      "\n\n- - - - - - - - - - - - - -\n\n" +
      resource.content;
    resource.info.ext = ".txt";
    responseData.status = 500;
    console.error(err);
  }

  return {
    resource,
    responseData,
  };
};

module.exports = flowchartLense;
