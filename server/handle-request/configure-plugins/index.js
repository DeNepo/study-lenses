'use strict'

const loadPlugins = require('./load-plugins.js')
const optionsPromise = loadPlugins('options')
const lensesPromise = loadPlugins('lenses')

const config = require('config')


const configurePlugins = async (localConfigs, parsedQuery) => {


  if (Object.keys(parsedQuery).includes('--ignore')) {
    return {
      requestedOptions: null,
      requestedLenses: null,
    }
  }

  Object.assign(config.LENSES, localConfigs['--defaults'])
  // console.log(config.LENSES)

  // filter selected options and assign query values
  const options = (await optionsPromise)
  const requestedOptions = Object.keys(parsedQuery)
    .map(queryKey => {
      return options.find(option => option.queryKey === queryKey)
    })
    .filter(option => option !== undefined)
  for (const option of requestedOptions) {
    try {
      option.queryValue = JSON.parse(parsedQuery[option.queryKey])
    } catch (o_0) {
      option.queryValue = parsedQuery[option.queryKey]
    }

    if (option.queryKey === '--defaults') {
      Object.assign(config.LENSES, option.queryValue)
    }

    Object.assign(option, localConfigs[option.queryKey])
  }
  // console.log(requestedOptions)
  // console.log(config.LENSES)


  // filter selected options, assign query values, and assign lense.json configurations
  const lenses = (await lensesPromise)
  const requestedLenses = Object.keys(parsedQuery)
    .map(queryKey => {
      return lenses.find(lense => lense.queryKey === queryKey)
    })
    .filter(lense => lense !== undefined)

  // assign configurations to the lenses if any were requested
  if (requestedLenses.length > 0) {
    for (const lense of requestedLenses) {
      // assign the express-parsed query value
      //  if possible, JSON parse the string
      try {
        lense.queryValue = JSON.parse(parsedQuery[lense.queryKey])
      } catch (o_0) {
        lense.queryValue = parsedQuery[lense.queryKey]
      }

      // assign local configurations
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
