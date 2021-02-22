/*



things i did not finish last night
- load docs into plugins as well in server/load-plugins
- pass a copy of lenses into each lens/option
- use that in the help


*/

"use strict";

const renderPluginDocs = require("./render-plugin-docs.js");

const renderMainDocs = require("./render-main-docs.js");

const helpOption = async ({ config, resource, lenses, options }) => {
  // console.log("docs!");

  if (resource.info) {
    resource.info.ext = ".html";
  } else {
    resource.info = { ext: ".html" };
  }

  if (config.queryValue) {
    resource.content = await renderPluginDocs({ config, lenses, options });
  } else {
    resource.content = await renderMainDocs({
      config,
      resource,
      lenses,
      options,
    });
  }

  return {
    resource,
  };
};

module.exports = helpOption;
