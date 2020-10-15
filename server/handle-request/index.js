'use strict'

// config
// logger

const areDifferent = require('./lib/are-different.js')

const loadPlugins = require('./lib/load-plugins.js')
const optionsPromise = loadPlugins('options')
const lensesPromise = loadPlugins('lenses')

const compileLenseConfigs = require('./lib/compile-lense-configs.js')

const subsetHttpData = require('./1-subset-http-data')
const filePathFromRequestPath = require('./2-file-path-from-url')
const resourceFromAbsolutePath = require('./3-resource-from-absolute-path')
const evaluateOptions = require('./4-evaluate-options')
const pipeResource = require('./5-pipe-resource')
const compileAndSendResponse = require('./compile-and-send-response')
// const handleError = require('./handle-error')
//  i'm not sure how to handle errors, or where (this file or sub-folders)
//  for developers, for the stability of the app
//  or how to communicate to students when an error has occurred
//    this app is a special case where the user is learning to code
//    maybe a more technical error report is ok?

const handleRequest = async (req, res) => {

  //    1. subset http data
  const { requestData, responseData } = subsetHttpData(req, res)
  // console.log(requestData)
  // console.log(responseData)


  //    2. get absolute file path from request path
  //  detects static resource paths and adjusts them
  const absolutePath = filePathFromRequestPath(req.path)
  // console.log(absolutePath)


  //    3. render resource from absolute path
  // render the path into a resource
  // -> see docs for the resource data type
  const resource = await resourceFromAbsolutePath(absolutePath, process.cwd())
  // console.log(resource)


  // filter selected options and assign query values
  const options = (await optionsPromise)
  const requestedOptions = Object.keys(req.query)
    .map(queryKey => {
      return options.find(option => option.queryKey === queryKey)
    })
    .filter(option => option !== undefined)
  for (const option of options) {
    option.queryValue = req.query[option.queryKey] || ''
  }
  // console.log(requestedOptions)


  // filter selected options, assign query values, and assign lense.json configurations
  const lenses = (await lensesPromise)
  const requestedLenses = Object.keys(req.query)
    .map(queryKey => {
      return lenses.find(lense => lense.queryKey === queryKey)
    })
    .filter(lense => lense !== undefined)

  // assign configurations to the lenses if any were requested
  if (requestedLenses.length > 0) {
    // assign the express-parsed query value
    for (const lense of requestedLenses) {
      lense.queryValue = req.query[lense.queryKey] || ''
    }
    // scan the directory of content for any local configurations
    const lenseConfigs = compileLenseConfigs(absolutePath, process.cwd())
    for (const lense of requestedLenses) {
      Object.assign(lense, lenseConfigs[lense.queryKey])
    }
    // console.log(JSON.stringify(lenseConfigs, null, '  '))
    // console.log(requestedLenses)
  }


  let returnedHooks = {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
    onError: []
  }
  if (requestedOptions.length !== 0) { // only evaluate options if the user requested any
    //    4. evaluate options
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

  let finalResource = resource
  let finalResponseData = responseData
  if (requestedLenses.length !== 0) { // only pipe resource if the user requested it
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
