'use strict';

const deepClone = require('../lib/deep-clone.js');

const configurePlugins = (plugins, localConfigs, parsedQuery) => {
  if (!plugins) {
    return [];
  }

  // change: mark as selected/unselected, don't filter
  const queryKeys = Object.keys(parsedQuery);
  const requestedPlugins = queryKeys
    .map((queryKey) =>
      plugins.find((plugin) => plugin.queryKey === queryKey.toLowerCase()),
    )
    .filter((plugin) => plugin !== undefined)
    .map((plugin) => ((plugin.requested = true), plugin));
  // const requestedPlugins = plugins
  //   .filter((plugin) => queryKeys.includes(plugin.queryKey))
  //   .map((plugin) => ((plugin.requested = false), plugin));

  const notRequestedPlugins = plugins
    .filter(
      (plugin) =>
        !queryKeys
          .map((queryKey) => queryKey.toLowerCase())
          .includes(plugin.queryKey),
    )
    .map((plugin) => ((plugin.requested = false), plugin));

  // assign configurations to the plugins if any were requested
  //  keeping query configurations separate from local configurations
  //  so lenses can decide which to use
  // for (const plugin of requestifiedPlugins) {
  for (const plugin of requestedPlugins) {
    plugin.requested = true;
    plugin.queryValue = parsedQuery[plugin.queryKey];

    // assign local configurations
    plugin.locals = Object.assign({}, localConfigs[plugin.queryKey]);
  }
  // console.log(JSON.stringify(localConfigs, null, '  '))
  // console.log(requestifiedPlugins)
  // console.log(requestedPlugins.map((plugin) => plugin.queryKey));
  // console.log(notRequestedPlugins.map((plugin) => plugin.queryKey));

  return deepClone([...requestedPlugins, ...notRequestedPlugins]);
};

module.exports = configurePlugins;
