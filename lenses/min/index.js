"use strict";

const terser = require("terser");
const htmlMinifierTerser = require("html-minifier-terser");
const csso = require("csso");

const minLense = async ({ resource }) => {
  if (!resource.info || !resource.content) {
    return;
  }

  try {
    if (resource.info.ext === ".js") {
      resource.content = (
        await terser.minify(resource.content, {
          compress: true,
        })
      ).code;
    } else if (resource.info.base.toLowerCase().includes(".html")) {
      resource.content = htmlMinifierTerser.minify(resource.content, {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    // else if (resource.info.ext === '.css') {
    //   resource.content = csso.minify(resource.content).css
    // }
  } catch (err) {
    console.log(err.name);
    resource.error = err;
  }

  return {
    resource,
  };
};

module.exports = minLense;
