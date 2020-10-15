'use strict'

// config
// logger

const areDifferent = require('./lib/are-different.js')

const filePathFromRequestPath = require('./file-path-from-url')
const configurePlugins = require('./configure-plugins')
const subsetHttpData = require('./subset-http-data')
const resourceFromAbsolutePath = require('./resource-from-absolute-path')
const evaluateOptions = require('./evaluate-options')
const pipeResource = require('./pipe-resource')
const compileLocalConfigs = require('./compile-local-configs')


const compileAndSendResponse = require('./compile-and-send-response')
// const handleError = require('./handle-error')
//  i'm not sure how to handle errors, or where (this file or sub-folders)
//  for developers, for the stability of the app
//  or how to communicate to students when an error has occurred
//    this app is a special case where the user is learning to code
//    maybe a more technical error report is ok?

const handleRequest = async (req, res) => {


  //  get absolute file path from request path
  //  detects static resource paths and adjusts them
  const absolutePath = filePathFromRequestPath(req.path)
  // console.log(absolutePath)

  // render resource from absolute path
  // render the path into a resource
  // -> see docs for the resource data type
  const resource = await resourceFromAbsolutePath(absolutePath, process.cwd())
  // console.log(resource)


  //   subset http data
  const { requestData, responseData } = subsetHttpData(req)
  // console.log(requestData)
  // console.log(responseData)



  const localConfigs = compileLocalConfigs(absolutePath, process.cwd())


  const ignore = localConfigs['--ignore']
  if (ignore) {
    //    compile and send the response
    compileAndSendResponse({
      req, res,
      finalResource: resource,
      finalResponseData: responseData
    })

    return
  }

  //  configure plugins
  //  filter out the requested options and lenses
  //  assign query values
  //  assign local lense.json configurations
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
    // console.log(areDifferent(optionedResource, resource))
    // console.log(areDifferent(optionedResponseData, responseData))

    // check if an option returned a modified resource or response data
    //  if they did, send the response immediately and return early
    if (
      areDifferent(optionedResponseData, responseData)
      || areDifferent(optionedResource, resource)
    ) {

      compileAndSendResponse({
        finalResource: optionedResource || resource,
        finalResponseData: optionedResponseData || responseData,
        req,
        res,
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
  compileAndSendResponse({ req, res, finalResource, finalResponseData })

}

module.exports = handleRequest
