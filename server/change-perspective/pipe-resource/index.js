'use strict';

// labeled blocks are there for readability
//  this file is long and busy, so you can collapse them and see the label

const deepClone = require('../../lib/deep-clone');
const evaluateHooks = require('./evaluate-hooks');

const pipeResource = async ({
  requestData,
  responseData,
  resource,
  lenses,
  options,
  hooks,
}) => {
  console.log(': piping request');

  let pipedRequestData = deepClone(requestData);
  let pipedResponseData = deepClone(responseData);
  let pipedResource = deepClone(resource);

  let hookErrors = [];
  let lenseError = null;

  beforeAll: {
    const beforeAllReturned = await evaluateHooks({
      requestData,
      responseData,
      resource,
      hooks: hooks.beforeAll,
      lens: null,
      lenses,
    });
    hookErrors.concat(beforeAllReturned.errors);
    if (beforeAllReturned.responseData || beforeAllReturned.resource) {
      return {
        pipedResponseData: beforeAllReturned.responseData || pipedResponseData,
        pipedResource: beforeAllReturned.resource || pipedResource,
        hookErrors,
        lenseError,
      };
    }
  }

  pipingResource: for (const lens of lenses) {
    // console.log(':  ' + lens.queryKey);
    if (!lens.requested) {
      continue;
    }

    beforeEach: {
      const beforeEachReturned = await evaluateHooks({
        requestData,
        responseData,
        resource,
        hooks: hooks.beforeEach,
        lens,
        lenses,
      });
      hookErrors.concat(beforeEachReturned.errors);
      if (beforeEachReturned.responseData || beforeEachReturned.resource) {
        return {
          pipedResponseData:
            beforeEachReturned.responseData || pipedResponseData,
          pipedResource: beforeEachReturned.resource || pipedResource,
          hookErrors,
          lenseError,
        };
      }
    }

    const config = Object.assign({}, lens);
    delete config.module;

    let onErrorReturned = {};
    let returned = {
      requestData: pipedRequestData,
      responseData: pipedResponseData,
      resource: pipedResource,
    };
    try {
      const config = Object.assign({}, lens);
      delete config.module;
      console.log(':  ' + config.queryKey);

      const clonedArgs = {
        config,
        requestData: deepClone(pipedRequestData),
        responseData: deepClone(pipedResponseData),
        resource: deepClone(pipedResource),
        options: deepClone(options),
        lenses: deepClone(lenses),
      };

      for (const lens of clonedArgs.lenses) {
        lens.use = (args = {}) =>
          // todo: a deep assign from args to clonedArgs
          //  easy for modifying ie. a single property of the config
          lens.module(Object.assign({}, clonedArgs, { config: lens }, args));
        clonedArgs.lenses[lens.queryKey] = lens;
      }

      returned = await lens.module(clonedArgs);

      if (returned && returned.abort === true) {
        return {
          abort: lens.queryKey,
        };
      }
      // todo: validate objects before cloning
      //  if they fail validation, use the previous
      if (returned) {
        pipedRequestData = deepClone(returned.requestData || pipedRequestData);
        pipedResponseData = deepClone(
          returned.responseData || pipedResponseData,
        );
        pipedResource = deepClone(returned.resource || pipedResource);
      }
    } catch (error) {
      console.log(': error in ' + lens.queryKey);
      lenseError = {
        error,
        lens,
      };
      onError: {
        onErrorReturned = await evaluateHooks({
          requestData: pipedRequestData,
          responseData: pipedResponseData,
          resource: pipedResource,
          hooks: hooks.onError,
          lens,
          lenses,
          error,
        });
        hookErrors.concat(onErrorReturned.errors);
      }
      // console.log(onErrorReturned)
      if (!onErrorReturned.recover) {
        // send no matter what, do not recover from an error in a lens
        resource.content = `an error occurred in the "${lens.queryKey}" lens.\n\nadd the --debug option to learn more\n\nor just remove it from the URL and refresh`;
        if (resource.info) {
          resource.info.ext = '.txt';
        } else {
          resource.info = { ext: '.txt' };
        }
        responseData.status = 500;
        // in case of a lens error, fall back to the original resource
        pipedResponseData = onErrorReturned.responseData || responseData;
        pipedResource = onErrorReturned.resource || resource;

        break pipingResource;
      }
    }

    afterEach: {
      const afterEachReturned = await evaluateHooks({
        requestData,
        responseData,
        resource,
        hooks: hooks.afterEach,
        lens,
        lenses,
      });
      hookErrors.concat(afterEachReturned.errors);
      if (afterEachReturned.responseData || afterEachReturned.resource) {
        return {
          pipedResponseData:
            afterEachReturned.responseData || pipedResponseData,
          pipedResource: afterEachReturned.resource || pipedResource,
          hookErrors,
          lenseError,
        };
      }
    }
  }

  afterAll: {
    const afterAllReturned = await evaluateHooks({
      requestData: pipedRequestData,
      responseData: pipedResponseData,
      resource: pipedResource,
      hooks: hooks.afterAll,
      lens: null,
      lenses,
    });
    hookErrors.concat(afterAllReturned.errors);
    if (afterAllReturned.responseData || afterAllReturned.resource) {
      return {
        pipedResponseData: afterAllReturned.responseData || pipedResponseData,
        pipedResource: afterAllReturned.resource || pipedResource,
        hookErrors,
        lenseError,
      };
    }
  }

  return {
    pipedResponseData: pipedResponseData,
    pipedResource: pipedResource,
    hookErrors,
    lenseError,
  };
};

module.exports = pipeResource;
