"use strict";

const deepMerge = require("deepmerge");
const combineMerge = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === "undefined") {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      const alreadyExists = destination.some((entry) =>
        util.isDeepStrictEqual(entry, item)
      );
      if (!alreadyExists) {
        destination.push(item);
      } else {
        destination[index] = deepMerge(target[index], item, options);
      }
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};

const resourceOption = ({ resource, config }) => {
  // // did the URL contain a resource?
  // const resourceProvided =
  //   req.query["--resource"] &&
  //   req.query["--resource"].resource &&
  //   typeof req.query["--resource"].resource === "object";
  // console.log(resourceProvided);
  // // should it be merged with the local resource?
  // const mergeWithLocalResource =
  //   resourceProvided && req.query["--resource"].merge;
  // console.log(mergeWithLocalResource);
  // // build the requested resource
  // let resource = {};
  // if (resourceProvided && mergeWithLocalResource) {
  //   // console.log("++ merge");
  //   const localResource = await resourceFromAbsolutePath({
  //     absolutePath,
  //     localConfigs,
  //   });
  //   resource = deepMerge(localResource, req.query["--resource"].resource, {
  //     arrayMerge: combineMerge,
  //   });
  // } else if (resourceProvided && !mergeWithLocalResource) {
  //   // console.log("++ not merge");
  //   resource = req.query["--resource"].resource;
  // } else {
  //   // console.log("++ local");
  //   resource = await resourceFromAbsolutePath({
  //     absolutePath,
  //     localConfigs,
  //   });
  // }
  // because the server's index.js handles this (for now)
  // if (config.queryValue.merge === true) {
  //   resource = deepMerge(resource, config.queryValue.resource, {
  //     arrayMerge: combineMerge,
  //   });
  // } else {
  //   resource = config.queryValue.resource;
  // }
  // console.log(resource);
  // return {
  //   resource,
  // };
};

module.exports = resourceOption;
