"use strict";

const JavaScriptObfuscator = require("javascript-obfuscator");

const obfLense = async ({ resource }) => {
  if (!resource.info || !resource.content) {
    return;
  }

  if (resource.info.ext !== ".js") {
    return;
  }

  try {
    resource.content = JavaScriptObfuscator.obfuscate(resource.content, {
      compact: false,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      shuffleStringArray: true,
      splitStrings: true,
      stringArrayThreshold: 1,
    }).getObfuscatedCode();
  } catch (err) {
    console.log(err.name);
    resource.error = err;
  }

  return {
    resource,
  };
};

module.exports = obfLense;
