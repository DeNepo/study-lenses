const configurePlugins = (plugins, localConfigs, parsedQuery) => {
  if (!plugins) {
    return [];
  }

  const requestedPlugins = Object.keys(parsedQuery)
    .map(queryKey => {
      return plugins.find(plugin => plugin.queryKey === queryKey)
    })
    .filter(plugin => plugin !== undefined)

  if (requestedPlugins.length === 0) {
    return null
  }

  // assign configurations to the plugins if any were requested
  //  keeping query configurations separate from local configurations
  //  so lenses can decide which to use
  for (const plugin of requestedPlugins) {
    // assign the express-parsed query value
    //  if possible, JSON parse the string
    try {
      plugin.queryValue = JSON.parse(parsedQuery[plugin.queryKey])
    } catch (o_0) {
      plugin.queryValue = parsedQuery[plugin.queryKey]
    }

    // assign local configurations
    plugin.locals = Object.assign({}, localConfigs[plugin.queryKey])
  }
  // console.log(JSON.stringify(localConfigs, null, '  '))
  // console.log(requestedPlugins)

  return requestedPlugins

}

module.exports = configurePlugins
