'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);

const isItADirectory = require('../lib/is-it-a-directory.js');

const loadPlugins = async (type, pluginsPath) => {
  if (!fs.existsSync(pluginsPath)) {
    return [];
  }

  // array of absolute paths to each plugin folder
  const pluginPaths = fs
    .readdirSync(pluginsPath)
    .map((subPath) => path.join(pluginsPath, subPath))
    .filter(isItADirectory);

  const plugins = [];

  for (const absolutePluginPath of pluginPaths) {
    if (!isItADirectory(absolutePluginPath)) {
      continue;
    }

    let module = null;
    try {
      const scriptPath = path.join(absolutePluginPath, 'index.js');
      const modulePath = path.join(absolutePluginPath, 'index.mjs');
      const pluginType = fs.existsSync(scriptPath)
        ? 'script'
        : fs.existsSync(modulePath)
        ? 'module'
        : 'no index file for this plugin';

      module =
        pluginType === 'script'
          ? require(scriptPath)
          : pluginType === 'module'
          ? (await import(modulePath)).default
          : pluginType;

      if (typeof module !== 'function') {
        throw new Error(
          path.basename(absolutePluginPath) + ': module is not a function',
        );
      }
    } catch (err) {
      console.error(err);
      // if there is an error loading the function, there's no point loading the plugin
      continue;
    }

    let userGuide = '';
    try {
      userGuide = await readFilePromise(
        path.join(absolutePluginPath, 'user-guide.md'),
        'utf-8',
      );
    } catch (err) {
      // console.error(err)
    }

    let docs = '';
    try {
      docs = await readFilePromise(
        path.join(absolutePluginPath, 'docs.md'),
        'utf-8',
      );
    } catch (err) {
      // console.error(err)
    }

    const nextPluginDirName = path.basename(absolutePluginPath);
    const nextPlugin = {
      module,
      queryKey: nextPluginDirName,
      queryValue: '',
      // these paths could be centrally configured
      ownStatic: `/own_static_resources_${type}/${nextPluginDirName}/static`,
      sharedStatic: `/shared_static_resources`,
      sharedComponents: `/shared_components`,
      userGuide,
      docs,
      type: type.includes('lens') ? 'lens' : 'option',
    };

    plugins.push(nextPlugin);
  }

  return plugins;
};

module.exports = loadPlugins;
