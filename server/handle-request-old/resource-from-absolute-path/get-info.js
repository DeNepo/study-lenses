'use strict'

const path = require('path')

const isItADirectory = require('../lib/is-it-a-directory.js')

const getInfo = (absoluteFilePath = '', cwd = process.cwd()) => {

  const toCwd = path.relative(absoluteFilePath, cwd)

  /*
    {
      root: '/',
      dir: '/Users/...',
      base: 'file.js.md',
      ext: '.md',
      name: 'file.js'
    }
    */
  const preInfo = path.parse(absoluteFilePath)

  /*
    {
      "root": process.cwd(),
      "dir": "/path/to",
      "base": "file.js.md",
      "ext": ".md"
      "name": "file.js",
      "type": "file",
    },
  */
  const info = Object.assign(preInfo,
    {
      root: cwd,
      dir: path.relative(cwd, preInfo.dir),
      type: isItADirectory(absoluteFilePath) ? 'directory' : 'file',
      toCwd
    }
  )

  return info

}

module.exports = getInfo
