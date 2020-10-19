'use strict'


const fs = require('fs')
const util = require('util')
const readFilePromise = util.promisify(fs.readFile)

const path = require('path')

const marked = require('marked')

const getGuideInfo = require('./get-guide-info')

const optionGuideInfo = getGuideInfo('options')

const lenseGuideInfo = getGuideInfo('lenses')


const helpOption = async ({ config, resource }) => {

  if (resource.info) {
    resource.info.ext = '.html'
  } else {
    resource.info = { ext: '.htmls' }
  }

  console.log('help!')

  let optionUserGuides = ''
  for (const info of optionGuideInfo) {
    const open = `<details><summary><code>?${info.queryKey}</code></summary><br>`
    const guide = `<section>${marked(await info.userGuide)}</section><hr>`
    const close = `</details>`
    optionUserGuides += open + guide + close
  }

  let lenseUserGuides = ''
  for (const info of lenseGuideInfo) {
    const open = `<details><summary><code>?${info.queryKey}</code></summary><br>`
    const guide = `<section>${marked(await info.userGuide)}</section><hr>`
    const close = `</details>`
    lenseUserGuides += open + guide + close
  }


  resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
  </head>
  <body class="markdown-body">
    <a href='${resource.info.toCwd}?hyf'><code>/?hyf</code>: back to main directory</a>
    <hr>
    ${marked(await readFilePromise(path.join(__dirname, 'main-help-text.md'), 'utf-8'))}
    <hr>
    <h1>Lenses</h1>
    The lenses you'll use the most
    <hr>
    ${lenseUserGuides}

    <hr>
    <h1>Options</h1>
    The two most helpful options
    <hr>
    ${optionUserGuides}

    <hr>
    <hr>
    <img alt="panda smash" src="${config.ownStatic}/panda-smash.gif" />

  </body>
</html>`;

  return {
    resource,
  }
}

module.exports = helpOption
