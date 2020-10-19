'use strict'

const fs = require('fs')
const util = require('util')


const readFilePromise = util.promisify(fs.readFile)

const renderVirtualDirectory = require('./render-virtual-directory/index.js')
const getInfo = require('./get-info.js')
const { resourceUsage } = require('process')


// rendered paths are inspired by path.parse, with with some (compatible?) modifications
//  see ./example-return-values.js for some example return values
const renderPath = async (absoluteFilePath = '', cwd = process.cwd(), localConfigs) => {
  let info = null
  let content = null
  let error = null

  const pathExists = fs.existsSync(absoluteFilePath)
  if (!pathExists) {
    return {
      info,
      content,
      error
    }
  }


  try {
    const requestedADirectory = fs.lstatSync(absoluteFilePath).isDirectory()
    if (requestedADirectory) {
      content = await renderVirtualDirectory({
        absolutePath: absoluteFilePath,
        studyConfig: localConfigs
      })

      info = getInfo(absoluteFilePath, cwd)
      info.ext = '.json'
    } else if (pathExists) {
      content = await readFilePromise(absoluteFilePath, 'utf-8')
      info = getInfo(absoluteFilePath, cwd)
    }

  } catch (err) {
    error = err

  }

  return {
    info,
    content,
    error
  }

}

module.exports = renderPath
