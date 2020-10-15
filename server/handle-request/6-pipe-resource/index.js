'use strict';

// labeled blocks are there for readability
//  this file is long and busy, so you can collapse them and see the label

const deepClone = require('../lib/deep-clone');
const evaluateHooks = require('./evaluate-hooks');

const pipeResource = async ({
  requestData, responseData, resource, lenses, hooks
}) => {

  console.log(': piping request')

  let pipedRequestData = deepClone(requestData)
  let pipedResponseData = deepClone(responseData)
  let pipedResource = deepClone(resource)

  let hookErrors = []
  let lenseError = null

  beforeAll: {
    const beforeAllReturned = await evaluateHooks({
      requestData,
      responseData,
      resource,
      hooks: hooks.beforeAll,
      lense: null,
      lenses,
    })
    hookErrors.concat(beforeAllReturned.errors)
    if (beforeAllReturned.responseData || beforeAllReturned.resource) {
      return {
        pipedResponseData: beforeAllReturned.responseData || pipedResponseData,
        pipedResource: beforeAllReturned.resource || pipedResource,
        hookErrors,
        lenseError
      }
    }
  }


  pipingResource: for (const lense of lenses) {

    beforeEach: {
      const beforeEachReturned = await evaluateHooks({
        requestData,
        responseData,
        resource,
        hooks: hooks.beforeEach,
        lense,
        lenses,
      })
      hookErrors.concat(beforeEachReturned.errors)
      if (beforeEachReturned.responseData || beforeEachReturned.resource) {
        return {
          pipedResponseData: beforeEachReturned.responseData || pipedResponseData,
          pipedResource: beforeEachReturned.resource || pipedResource,
          hookErrors,
          lenseError
        }
      }
    }


    const config = Object.assign({}, lense)
    delete config.module

    let onErrorReturned = {}
    let returned = {
      requestData: pipedRequestData,
      responseData: pipedResponseData,
      resource: pipedResource
    }
    try {
      const config = Object.assign({}, lense)
      delete config.module

      returned = await lense.module({
        config,
        requestData: deepClone(pipedRequestData),
        responseData: deepClone(pipedResponseData),
        resource: deepClone(pipedResource),
      })

      // todo: validate objects before cloning
      //  if they fail validation, use the previous
      if (returned) {
        pipedRequestData = deepClone(returned.requestData || pipedRequestData)
        pipedResponseData = deepClone(returned.responseData || pipedResponseData)
        pipedResource = deepClone(returned.resource || pipedResource)
      }
    } catch (error) {

      lenseError = {
        error,
        lense
      }
      onError: {
        onErrorReturned = await evaluateHooks({
          requestData: pipedRequestData,
          responseData: pipedResponseData,
          resource: pipedResource,
          hooks: hooks.onError,
          lense,
          lenses,
          error,
        })
        hookErrors.concat(onErrorReturned.errors)
      }
      // console.log(onErrorReturned)
      if (!onErrorReturned.recover) {
        // send no matter what, do not recover from an error in a lense
        resource.content = `an error occurred in the "${lense.queryKey}" lense.\n\ntry removing it from the URL and refreshing`
        resource.info.ext = '.txt'
        responseData.status = 500
        // in case of a lense error, fall back to the original resource
        pipedResponseData = onErrorReturned.responseData || responseData
        pipedResource = onErrorReturned.resource || resource

        break pipingResource
      }

    }

    afterEach: {
      const afterEachReturned = await evaluateHooks({
        requestData,
        responseData,
        resource,
        hooks: hooks.afterEach,
        lense,
        lenses,
      })
      hookErrors.concat(afterEachReturned.errors)
      if (afterEachReturned.responseData || afterEachReturned.resource) {
        return {
          pipedResponseData: afterEachReturned.responseData || pipedResponseData,
          pipedResource: afterEachReturned.resource || pipedResource,
          hookErrors,
          lenseError
        }
      }
    }
  }

  afterAll: {
    const afterAllReturned = await evaluateHooks({
      requestData: pipedRequestData,
      responseData: pipedResponseData,
      resource: pipedResource,
      hooks: hooks.afterAll,
      lense: null,
      lenses,
    })
    hookErrors.concat(afterAllReturned.errors)
    if (afterAllReturned.responseData || afterAllReturned.resource) {
      return {
        pipedResponseData: afterAllReturned.responseData || pipedResponseData,
        pipedResource: afterAllReturned.resource || pipedResource,
        hookErrors,
        lenseError
      }
    }
  }

  return {
    pipedResponseData: pipedResponseData,
    pipedResource: pipedResource,
    hookErrors,
    lenseError
  }
};

module.exports = pipeResource;
