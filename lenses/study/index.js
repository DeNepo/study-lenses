'use strict'


const detectType = require('./lib/detect-type.js')

const liveStudyLense = async ({ config, resource }) => {



  const type = detectType(resource)


  let typeView = () => { }
  try {
    typeView = require(`./views/${type}.js`)
  } catch (o_0) {
    typeView = require(`./views/code.js`)
  }

  config.code = encodeURIComponent(resource.content)
  config.ext = resource.info.ext

  resource.content = typeView({ resource, config, type })
  resource.info.ext = '.html'

  return {
    resource
  }


}

module.exports = liveStudyLense
