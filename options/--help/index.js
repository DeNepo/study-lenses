'use strict'


const marked = require('marked')

const getGuideInfo = require('./get-guide-info')

const optionGuideInfo = getGuideInfo('options')

const lenseGuideInfo = getGuideInfo('lenses')


const helpOption = async ({ config }) => {

  const resource = {
    info: {
      ext: '.html'
    }
  }

  console.log('help!')

  let optionUserGuides = ''
  for (const info of optionGuideInfo) {
    const open = `<details><summary><code>${info.queryKey}</code></summary><br>`
    const guide = `<section>${marked(await info.userGuide)}</section><hr>`
    const close = `</details>`
    optionUserGuides += open + guide + close
  }

  let lenseUserGuides = ''
  for (const info of lenseGuideInfo) {
    const open = `<details><summary><code>${info.queryKey}</code></summary><br>`
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
