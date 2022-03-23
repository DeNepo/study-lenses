'use strict';

const evaluateOptions = require('./evaluate-options');
const pipeResource = require('./pipe-resource');

const changePerspective = async ({
  requestData,
  responseData,
  lenses,
  options,
  resource,
}) => {
  const requestedOptions = options.find((option) => option.requested);
  const requestedLenses = lenses.find((lens) => lens.requested);

  let configuredHooks = {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
    onError: [],
  };

  if (requestedOptions) {
    // evaluate options
    // if the options modify the resource or response data, send immediately
    // options are not lenses, they shouldn't be used to change the response
    //  only to intercept it
    const {
      optionedResource,
      optionedRequestData,
      optionedResponseData,
      hooks,
      abort, // fallback to static serving
      overWritten, // the resource was overwritten by a non-modifying option
      optionError, // not sure what to do about this
    } = await evaluateOptions({
      resource,
      requestData,
      responseData,
      options,
      lenses,
    });

    if (abort) {
      return {
        abort,
      };
    }

    // check if an option modified the response
    //  if they did, send the response immediately and return early
    if (overWritten) {
      // if (
      //   !util.isDeepStrictEqual(optionedResponseData, responseData) ||
      //   !util.isDeepStrictEqual(optionedResource, resource)
      // ) {
      return {
        finalResource: optionedResource,
        finalResponseData: optionedResponseData,
      };
    } else {
      resource = optionedResource || resource;
      requestData = optionedRequestData || requestData;
      responseData = optionedResponseData || responseData;
    }

    configuredHooks = hooks;
  }

  let finalResource = resource;
  let finalResponseData = responseData;
  if (requestedLenses) {
    const {
      pipedResource,
      pipedResponseData,
      abort,
      lenseError, // not sure what to do about these
      hookErrors,
    } = await pipeResource({
      resource,
      requestData,
      responseData,
      lenses,
      hooks: configuredHooks,
    });

    if (abort) {
      return {
        abort,
      };
    }
    // console.log(pipedResource)
    // console.log(pipedResponseData)

    finalResponseData = pipedResponseData || finalResponseData;
    finalResource = pipedResource || finalResource;
  }

  return {
    finalResponseData,
    finalResource,
  };
};

module.exports = changePerspective;
