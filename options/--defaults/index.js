const globalConfig = require('config')

const defaultsOption = ({ config }) => {
  console.log(config.queryValue)
  Object.assign(globalConfig.LENSES, config.queryValue)
}


module.exports = defaultsOption
