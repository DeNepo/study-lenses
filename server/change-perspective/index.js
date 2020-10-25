'use strict';

const fs = require('fs');
const path = require('path');

const changePerspective = ({ requestData, ResponseData, absolutePath }) => {

  const resource = {
    content: null,
    info: null,
    error: null
  }


  const absolutePath = path.join(process.cwd(), requestPath);

  if (!fs.existsSync(absolutePath)) {
    responseData.status = 404;
    return {
      finalResource: resource,
      finalResponseData: responseData
    }
  }


  const localConfigs = compileLocalConfigs(absolutePath, process.cwd(), { ['--defaults']: Object.assign({}, globalDefaults) })
  // console.log(JSON.stringify(localConfigs, null, '  '))


  // render resource from absolute path
  // render the path into a resource
  // -> see docs for the resource data type
  const resource = await resourceFromAbsolutePath(absolutePath, process.cwd(), localConfigs)
  // console.log(resource)


  if (localConfigs['--ignore']) {
    //    compile and send the response
    compileAndSendResponse({
      req, res,
      finalResource: resource,
      finalResponseData: responseData,
      absolutePath
    })

    return
  }


  //   subset http data
  const { requestData, responseData } = subsetHttpData(req)
  // console.log(requestData)
  // console.log(responseData)


  //  configure plugins
  //  filter out the requested options and lenses
  //  assign query values
  //  assign local lens.json configurations
  const { requestedOptions, requestedLenses } = await configurePlugins(localConfigs, req.query)


  let returnedHooks = {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
    onError: []
  }
  if (requestedOptions) { // only evaluate options if the user requested any
    // evaluate options
    // if the options modify the resource or response data, send immediately
    // options are not lenses, they shouldn't be used to change the response
    //  only to intercept it
    const {
      optionedResource,
      optionedResponseData,
      hooks,
      optionError, // not sure what to do about this
    } = await evaluateOptions({
      resource,
      requestData,
      responseData,
      options: requestedOptions,
      lenses: requestedLenses,
    })
    // console.log(optionedResource)
    // console.log(!util.isDeepStrictEqual(optionedResource, resource))
    // console.log(!util.isDeepStrictEqual(optionedResponseData, responseData))

    // check if an option returned a modified resource or response data
    //  if they did, send the response immediately and return early
    if (
      !util.isDeepStrictEqual(optionedResponseData, responseData)
      || !util.isDeepStrictEqual(optionedResource, resource)
    ) {

      compileAndSendResponse({
        finalResource: optionedResource || resource,
        finalResponseData: optionedResponseData || responseData,
        req,
        res,
        absolutePath
      })

      return
    }

    returnedHooks = hooks
  }

  // pipe the resource through the lenses and hooks, if any lenses were requested
  let finalResource = resource
  let finalResponseData = responseData
  if (requestedLenses) { // only pipe resource if the user requested it
    //    6. pipe resource
    const {
      pipedResource,
      pipedResponseData,
      lenseError, // not sure what to do about these
      hookErrors
    } = await pipeResource({
      resource,
      requestData,
      responseData,
      lenses: requestedLenses,
      hooks: returnedHooks,
    })
    // console.log(finalResource)
    // console.log(finalResponseData)

    finalResponseData = pipedResponseData || responseData
    finalResource = pipedResource || resource

  }


  //    compile and send the response
  compileAndSendResponse({ req, res, finalResource, finalResponseData, absolutePath })


  return {
    finalResponseData: {
      status: 200
    },
    finalResource: {
      content: 'hello',
      info: {
        ext: '.txt'
      }
    }
  }
}

module.exports = changePerspective
