const fs = require("fs")
const path = require("path")

const getInfo = require('../get-info.js')
const isItAFile = require('../../lib/is-it-a-file')
const deepSortChildren = require('./deep-sort-children.js')


const renderVirtualDirectory = (absolutePath, gitignore = []) => {

  const toCwd = path.relative(absolutePath, process.cwd())

  if (isItAFile(absolutePath)) {
    return getInfo(absolutePath, process.cwd())
  }

  const virDir = getInfo(absolutePath, process.cwd())
  virDir.toCwd = toCwd
  virDir.children = []

  const paths = fs.readdirSync(absolutePath)

  if (paths.includes('.gitignore')) {
    gitignore = []
    const toIgnore = fs.readFileSync(path.join(absolutePath, '.gitignore'), 'utf-8')
    toIgnore.split('\n').forEach(ignorable => {
      gitignore.push(ignorable)
    })
  }

  for (let nextSubPath of paths) {

    if (nextSubPath[0] === '.') {
      continue
    }
    if (gitignore.includes(nextSubPath)) {
      continue
    }


    const nextAbsolutePath = path.join(absolutePath, nextSubPath)
    if (!fs.existsSync(nextAbsolutePath)) {
      continue
    }

    const nextChild = renderVirtualDirectory(nextAbsolutePath, gitignore)
    virDir.children.push(nextChild)

  }


  deepSortChildren(virDir)

  return virDir
}



module.exports = renderVirtualDirectory
