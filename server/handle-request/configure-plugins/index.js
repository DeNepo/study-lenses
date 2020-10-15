'use strict'

const loadPlugins = require('./load-plugins.js')
const optionsPromise = loadPlugins('options')
const lensesPromise = loadPlugins('lenses')


const configurePlugins = async (localConfigs, parsedQuery) => {


  // filter selected options and assign query values
  const options = (await optionsPromise)
  const requestedOptions = Object.keys(parsedQuery)
    .map(queryKey => {
      return options.find(option => option.queryKey === queryKey)
    })
    .filter(option => option !== undefined)
  for (const option of options) {
    option.queryValue = parsedQuery[option.queryKey] || ''
  }
  // console.log(requestedOptions)


  // filter selected options, assign query values, and assign lense.json configurations
  const lenses = (await lensesPromise)
  const requestedLenses = Object.keys(parsedQuery)
    .map(queryKey => {
      return lenses.find(lense => lense.queryKey === queryKey)
    })
    .filter(lense => lense !== undefined)

  // assign configurations to the lenses if any were requested
  if (requestedLenses.length > 0) {
    // assign the express-parsed query value
    for (const lense of requestedLenses) {
      lense.queryValue = parsedQuery[lense.queryKey] || ''
    }
    // scan the directory of content for any local configurations
    for (const lense of requestedLenses) {
      Object.assign(lense, localConfigs[lense.queryKey])
    }
    // console.log(JSON.stringify(localConfigs, null, '  '))
    // console.log(requestedLenses)
  }

  // ternaries :(
  return {
    requestedOptions: requestedOptions.length === 0
      ? null : requestedOptions,
    requestedLenses: requestedLenses.length === 0
      ? null : requestedLenses
  }

}


module.exports = configurePlugins
