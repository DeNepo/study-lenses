'use strict'

const loadPlugins = require('./load-plugins.js')
const optionsPromise = loadPlugins('options')
const lensesPromise = loadPlugins('lenses')


const configurePlugins = async (localConfigs, parsedQuery) => {


  if (Object.keys(parsedQuery).includes('--ignore')) {
    return {
      requestedOptions: null,
      requestedLenses: null,
    }
  }

  // console.log(config['--defaults'])

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

    option.locals = Object.assign({}, localConfigs[option.queryKey])

    if (option.queryKey === '--defaults') {
      Object.assign(localConfigs['--defaults'], option.queryValue)
    }
  }
  // console.log(requestedOptions)
  // console.log(config['--defaults'])


  // filter selected options, assign query values, and assign lens.json configurations
  const lenses = (await lensesPromise)
  const requestedLenses = Object.keys(parsedQuery)
    .map(queryKey => {
      return lenses.find(lens => lens.queryKey === queryKey)
    })
    .filter(lens => lens !== undefined)

  // assign configurations to the lenses if any were requested
  if (requestedLenses.length > 0) {
    for (const lens of requestedLenses) {
      // assign the express-parsed query value
      //  if possible, JSON parse the string
      try {
        lens.queryValue = JSON.parse(parsedQuery[lens.queryKey])
      } catch (o_0) {
        lens.queryValue = parsedQuery[lens.queryKey]
      }

      // assign local configurations
      lens.locals = Object.assign({}, localConfigs[lens.queryKey])
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
