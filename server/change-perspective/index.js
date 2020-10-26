'use strict';

const util = require('util')

const evaluateOptions = require('./evaluate-options')
const pipeResource = require('./pipe-resource')

const changePerspective = async ({
  requestData,
  responseData,
  lenses,
  options,
  resource
}) => {


  let configuredHooks = {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
    onError: []
  }
  if (options) {
    // evaluate options
    // if the options modify the resource or response data, send immediately
    // options are not lenses, they shouldn't be used to change the response
    //  only to intercept it
    const {
      optionedResource,
      optionedResponseData,
      hooks,
      send, // maybe do this instead of comparing to send?
      optionError, // not sure what to do about this
    } = await evaluateOptions({
      resource,
      requestData,
      responseData,
      options,
      lenses,
    })

    // // or this?
    // if (send) {

    // check if an option
    //  if they did, send the response immediately and return early
    if (
      !util.isDeepStrictEqual(optionedResponseData, responseData)
      || !util.isDeepStrictEqual(optionedResource, resource)
    ) {
      return {
        finalResource: optionedResource,
        finalResponseData: optionedResponseData
      }
    }

    configuredHooks = hooks
  }

  let finalResource = resource
  let finalResponseData = responseData
  if (lenses) {

    const {
      pipedResource,
      pipedResponseData,
      lenseError, // not sure what to do about these
      hookErrors
    } = await pipeResource({
      resource,
      requestData,
      responseData,
      lenses,
      hooks: configuredHooks
    })

    // console.log(pipedResource)
    // console.log(pipedResponseData)

    finalResponseData = pipedResponseData || finalResponseData
    finalResource = pipedResource || finalResource
  }


  return {
    finalResponseData,
    finalResource,
  }
}

module.exports = changePerspective
