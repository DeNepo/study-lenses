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

const responseOption = ({ response }) => {
  response = deepMerge(config.locals, preDefaults, {
    arrayMerge: combineMerge,
  });
  return {
    response,
  };
};

module.exports = responseOption;
