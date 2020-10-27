'use strict'

/* refactor

  include study.json's directly as a .study property on directory objects

  then toc-docs can have default queries at any depth

*/



const fs = require("fs")
const path = require("path")
const util = require('util')
const readFilePromise = util.promisify(fs.readFile)

const parseGitignore = require('parse-gitignore')

const getInfo = require('../get-info.js')
const isItAFile = require('../../lib/is-it-a-file')
const deepSortChildren = require('./deep-sort-children.js')

const deepMerge = require('deepmerge');
const combineMerge = (target, source, options) => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      const alreadyExists = destination.some(entry => areDeeplyEqual(entry, item))
      if (!alreadyExists) {
        destination.push(item)
      } else {
        destination[index] = deepMerge(target[index], item, options)
      }
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}


/*  BREAKING: changed to destructure syntax  */
const renderVirtualDirectory = async ({ absolutePath, gitignore = [], studyConfig = {} }) => {

  const toCwd = path.relative(absolutePath, process.cwd())

  if (isItAFile(absolutePath)) {
    return getInfo(absolutePath, process.cwd())
  }


  const paths = fs.readdirSync(absolutePath)


  if (paths.includes('study.json')) {
    // const thisConfig = fs.readFileSync(path.join(absolutePath, 'study.json'), 'utf-8')
    try {
      const thisConfig = await readFilePromise(path.join(absolutePath, 'study.json'), 'utf-8')
      const parsedConfig = JSON.parse(thisConfig)
      studyConfig = deepMerge(studyConfig, parsedConfig, { arrayMerge: combineMerge })
    } catch (o_0) {
      console.error(o_0)
    }
  }

  const virDir = getInfo(absolutePath, process.cwd())
  virDir.toCwd = toCwd
  virDir.locals = studyConfig
  virDir.children = []

  if (paths.includes('.gitignore')) {
    gitignore = parseGitignore(fs.readFileSync(path.join(absolutePath, '.gitignore'), 'utf8'))
  }

  for (let nextSubPath of paths) {

    if (nextSubPath[0] === '.') {
      continue
    }
    // quick fix to avoid node_modules, full gitignore later
    if (nextSubPath.search('node_modules')) {
      continue
    }

    const nextAbsolutePath = path.join(absolutePath, nextSubPath)

    if (gitignore.some(toIgnore => nextAbsolutePath.search(toIgnore))) {
      continue
    }

    if (!fs.existsSync(nextAbsolutePath)) {
      continue
    }

    const nextChild = await renderVirtualDirectory({
      absolutePath: nextAbsolutePath,
      gitignore,
      studyConfig
    })
    virDir.children.push(nextChild)

  }

  deepSortChildren(virDir)

  return virDir
}



module.exports = renderVirtualDirectory
