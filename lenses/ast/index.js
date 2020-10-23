'use strict';

const Acorn = require("acorn")


const astLens = ({ resource, config }) => {

  if (!resource.info && !resource.info.ext === '.js') {
    return
  }

  if (typeof config.queryValue.content === 'string') {
    resource.content = config.queryValue.content
  }

  resource.content = Acorn.parse(resource.content, { locations: true })
  resource.info.ext = '.json'

  return {
    resource
  }


}

module.exports = astLens
