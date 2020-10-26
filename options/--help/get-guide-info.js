const path = require('path')
const fs = require('fs')

const util = require('util')
const readFilePromise = util.promisify(fs.readFile)

const isItADirectory = require('../../server/lib/is-it-a-directory')

const documentThese = require('./document-these.json')

const getGuideInfo = (type) => {
  return fs.readdirSync(path.join(__dirname, '..', '..', type))
    .map(name => path.join(__dirname, '..', '..', type, name))
    .filter(isItADirectory)
    .filter(pluginPath => {
      return documentThese[type].includes(path.basename(pluginPath))
    })
    .map(absolutePath => {
      const info = {
        queryKey: path.basename(absolutePath),
        userGuide: readFilePromise(path.join(absolutePath, 'user-guide.md'), 'utf-8')
      }
      return info
    })
    .filter(next => next !== null)
}

module.exports = getGuideInfo
