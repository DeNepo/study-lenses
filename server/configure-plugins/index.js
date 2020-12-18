const deepDecodeURIComponent = (thing) => {
  if (typeof thing === "string") {
    try {
      return decodeURIComponent(thing);
    } catch (o_0) {
      console.error(o_0);
      return thing;
    }
  } else if (Array.isArray(thing)) {
    return thing.map(deepDecodeURIComponent);
  } else if (thing && typeof thing === "object") {
    const decoded = {};
    for (const key in thing) {
      decoded[key] = deepDecodeURIComponent(thing[key]);
    }
    return decoded;
  } else {
    return thing;
  }
};

const configurePlugins = (plugins, localConfigs, parsedQuery) => {
  if (!plugins) {
    return [];
  }

  const requestedPlugins = Object.keys(parsedQuery)
    .map((queryKey) => {
      return plugins.find((plugin) => plugin.queryKey === queryKey);
    })
    .filter((plugin) => plugin !== undefined);

  if (requestedPlugins.length === 0) {
    return null;
  }

  // assign configurations to the plugins if any were requested
  //  keeping query configurations separate from local configurations
  //  so lenses can decide which to use
  for (const plugin of requestedPlugins) {
    // assign the express-parsed query value
    //  if possible, JSON parse the string
    try {
      const pluginQuery = parsedQuery[plugin.queryKey];
      const parsedPluginQuery = JSON.parse(pluginQuery);
      plugin.queryValue = deepDecodeURIComponent(parsedPluginQuery);
    } catch (o_0) {
      plugin.queryValue = parsedQuery[plugin.queryKey];
    }

    // assign local configurations
    plugin.locals = Object.assign({}, localConfigs[plugin.queryKey]);
  }
  // console.log(JSON.stringify(localConfigs, null, '  '))
  // console.log(requestedPlugins)

  return requestedPlugins;
};

module.exports = configurePlugins;
