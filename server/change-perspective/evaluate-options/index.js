"use strict";

// labeled blocks are used just as a convenience in the editor
//  you can collapse them and still read what that block does

const deepClone = require("../../lib/deep-clone.js");

const evaluateOptions = async ({
  requestData,
  responseData,
  resource,
  options,
  lenses,
}) => {
  console.log(": evaluating options");

  let optionedRequestData = requestData;
  let optionedResponseData = responseData;
  let optionedResource = resource;
  let overWritten = false;
  let optionError = null;
  const hooks = {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
    onError: [],
  };

  pipeOptions: for (const nextOption of options) {
    if (!nextOption.requested) {
      continue;
    }

    console.log(":  " + nextOption.queryKey);

    const config = Object.assign({}, nextOption);
    delete config.module;

    let returned = {};
    try {
      returned =
        (await nextOption.module({
          config,
          requestData: deepClone(requestData),
          responseData: deepClone(responseData),
          resource: deepClone(resource),
          options: deepClone(options),
          lenses: deepClone(lenses),
        })) || {};

      if (returned && returned.abort === true) {
        return {
          abort: nextOption.queryKey,
        };
      }

      // todo: validate objects before continuing
      //  if they fail validation, use the previous
      if (
        !overWritten &&
        (returned.responseData || returned.requestData || returned.resource)
      ) {
        // execute all options, but return the values from the first to return values
        //  unless it's the modifying lenses
        if (
          nextOption.queryKey !== "--resource" &&
          nextOption.queryKey !== "--request" &&
          nextOption.queryKey !== "--response"
        ) {
          overWritten = true;
        }
        optionedRequestData = returned.requestData || requestData;
        optionedResponseData = returned.responseData || responseData;
        optionedResource = returned.resource || resource;
      }
    } catch (error) {
      // how to handle this?
      optionError = error;
      console.error(error);
    }

    if (!returned || typeof returned.hooks !== "object") {
      continue;
    }
    for (const key in hooks) {
      if (typeof returned.hooks[key] === "function") {
        returned.hooks[key].queryKey = nextOption.queryKey;
        hooks[key].push(returned.hooks[key]);
      }
    }
  }

  return {
    overWritten,
    optionedResource,
    optionedRequestData,
    optionedResponseData,
    optionError,
    hooks,
  };
};

module.exports = evaluateOptions;
