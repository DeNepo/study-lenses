'use strict'

const deepClone = require('../lib/deep-clone')

const evaluateHooks = async ({
  requestData, responseData, resource, hooks, lense, error, lenses
}) => {

  let hookedResponseData = null
  let hookedResource = null
  let overWritten = false
  let recover = false
  const errors = []
  try {
    for (const hook of hooks) {

      // console.log(hook.queryKey)

      const returned = await hook({
        requestData: deepClone(requestData),
        responseData: deepClone(responseData),
        resource: deepClone(resource),
        lense: deepClone(lense),
        lenses: deepClone(lenses),
        error: deepClone(error),
      })

      recover = recover || (returned && returned.recover) || false
      // console.log(recover)

      if (!overWritten && returned && (returned.responseData || returned.resource)) {
        // execute all hooks, but return the values from the first one to return values
        overWritten = true
        hookedResponseData = returned.responseData || responseData
        hookedResource = returned.resource || resource
      }
    }
  } catch (error) {
    console.log(error)
    errors.push(error)
  }


  return {
    resource: hookedResource,
    responseData: hookedResponseData,
    recover: recover,
    errors,
  }

}


module.exports = evaluateHooks
