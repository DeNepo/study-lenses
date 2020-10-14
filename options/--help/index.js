'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const readFilePromise = util.promisify(fs.readFile)

const optionGuideInfo = fs.readdirSync(path.join(__dirname, '..'))
  .map(optionPath => ({
    queryKey: optionPath,
    userGuide: readFilePromise(path.join(__dirname, '..', optionPath, 'user-guide.md'), 'utf-8')
  }))

const lenseGuideInfo = fs.readdirSync(path.join(__dirname, '..', '..', 'lenses'))
  .map(lensePath => ({
    queryKey: lensePath,
    userGuide: readFilePromise(path.join(__dirname, '..', '..', 'lenses', lensePath, 'user-guide.md'), 'utf-8')
  }))

const marked = require('marked')



const helpOption = async ({ config }) => {

  const resource = {
    info: {
      ext: '.html'
    }
  }

  console.log('help!')

  let optionUserGuides = ''
  for (const info of optionGuideInfo) {
    const open = `<details><summary><code>${info.queryKey}</code></summary>`
    const guide = `<section>${marked(await info.userGuide)}</section><hr>`
    const close = `</details>`
    optionUserGuides += open + guide + close
  }

  let lenseUserGuides = ''
  for (const info of lenseGuideInfo) {
    const open = `<details><summary><code>${info.queryKey}</code></summary>`
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
    <h1>Help!</h1>
    <img alt="panda smash" src="${config.ownStatic}/panda-smash.gif" />
    <hr>
    <h1>Lenses</h1>
    <hr>
    ${lenseUserGuides}

    <hr>
    <h1>Options</h1>
    <hr>
    ${optionUserGuides}

  </body>
</html>`;

  return {
    resource,
  }
}

module.exports = helpOption
