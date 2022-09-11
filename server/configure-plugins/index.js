'use strict';

const path = require('path');
const fs = require('fs');

const deepClone = require('../lib/deep-clone.js');

const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf-8'),
);

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
  for (const plugin of requestedPlugins) {
    plugin.requested = true;
    plugin.queryValue = parsedQuery[plugin.queryKey];

    // assign local configurations
    plugin.locals = Object.assign({}, localConfigs[plugin.queryKey]);
    plugin.version = version;
  }

  // assign other configs to a plugin according to the "--use" option
  for (const plugin of requestedPlugins) {
    const otherConfig = plugin.locals['--use'];
    const otherPlugin = plugins.find(
      (nextPlugin) => nextPlugin.queryKey === otherConfig,
    );

    if (otherConfig && otherPlugin) {
      plugin.locals = Object.assign(
        {},
        localConfigs[otherPlugin.queryKey],
        plugin.locals,
      );
    }
  }

  return deepClone([...requestedPlugins, ...notRequestedPlugins]);
};

module.exports = configurePlugins;
