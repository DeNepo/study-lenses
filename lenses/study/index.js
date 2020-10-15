'use strict'


const detectType = require('./lib/detect-type.js')

const liveStudyLense = async ({ config, resource }) => {



  const type = detectType(resource)

  let typeView = require(`./views/${type}.js`)

  resource.content = typeView({ resource, config, type })
  resource.info.ext = '.html'

  return {
    resource
  }

  // const typePath = `${config.ownStatic}/types/${type}/index.js`

  // config.path = resource.info.toCwd + '/' + resource.info.dir
  // config.type = type
  // config.source = resource.content

  // const view = renderView(type, config)

}

module.exports = liveStudyLense
