'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

const readFilePromise = util.promisify(fs.readFile)

const isItADirectory = require('./lib/is-it-a-directory.js')


const loadPlugins = async (type) => {

  const pluginsPath = path.join(__dirname, '..', '..', type)

  // array of absolute paths to each plugin folder
  const pluginPaths = fs.readdirSync(pluginsPath)
    .map(subPath => path.join(pluginsPath, subPath))
    .filter(isItADirectory)


  const plugins = []

  for (const absolutePluginPath of pluginPaths) {

    let module = null
    try {
      module = require(path.join(absolutePluginPath, 'index.js'))
      if (typeof module !== 'function') {
        throw new Error('module is not a function')
      }
    } catch (err) {
      console.log(err)
      // if there is an error loading the function, there's no point loading the plugin
      continue
    }

    let userGuide = ''
    try {
      userGuide = await readFilePromise(path.join(absolutePluginPath, 'user-guide.md'), 'utf-8')
    } catch (err) {
      console.log(err)
    }

    const nextPluginDirName = path.basename(absolutePluginPath)
    const nextPlugin = {
      module,
      queryKey: nextPluginDirName,
      queryValue: '',
      // these paths could be centrally configured
      ownStatic: `/own_static_resource__${type}__${nextPluginDirName}__`,
      sharedStatic: `/shared_static_resource`,
      userGuide
    }

    plugins.push(nextPlugin)
  }


  return plugins

}


module.exports = loadPlugins
