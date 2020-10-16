const globalConfig = require('config')

const defaultsOption = ({ config }) => {
  Object.assign(globalConfig.LENSES, config.queryValue)
}


module.exports = defaultsOption
