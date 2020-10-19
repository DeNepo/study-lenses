'use strict'

const path = require('path')
const fs = require('fs')
const util = require('util')
const writeFilePromise = util.promisify(fs.writeFile)


const detectType = require('./lib/detect-type.js')

const renderDependencies = require('./lib/render-dependencies.js')

const liveStudyLense = async ({ config, resource, responseData, requestData }) => {

  if (requestData.method === 'POST') {
    console.log('-- POST')
    try {
      const absolutePath = path.join(resource.info.root, resource.info.dir, resource.info.base)
      await writeFilePromise(absolutePath, requestData.body.text, 'utf-8');
      resource.content = 'changes were saved'
      resource.info.ext = '.txt'
      return {
        resource
      }
    } catch (err) {
      console.log(err);
      responseData.status = 500
      resource.content = 'unable to save changes.  check server logs for more info'
      resource.info.ext = '.txt'
      return {
        resource,
        responseData
      }
    }
  }

  const type = detectType(resource)


  let typeView = () => { }
  try {
    typeView = new (require(`./views/${type}.js`))({ resource, config })
  } catch (o_0) {
    typeView = new (require(`./views/code.js`))({ resource, config })
  }

  config.content = resource.content
  config.ext = resource.info.ext

  if (typeof config.readOnly !== 'boolean') {
    config.readOnly = false
  }

  resource.info.ext = '.html'
  resource.content = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${resource.info.dir}/${resource.info.base}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  ${typeView.styles()}

  ${typeView.scriptsHead()}

  ${renderDependencies(config.dependencies, resource)}

</head>

<body>

  <section>
    <div class="dropdown">
      <code>&#187; options &#171;</code>
      <div class='dropdown-content'>
        <a href='?--help' target='_blank'><code>--help</code>!  what is this?</a>
        ${typeView.configOptions()}
      </div>
    </div>
    ${typeView.panel()}
  </section>
  <main>
    ${typeView.code()}
  </main>

  ${typeView.configScript()}

  ${typeView.scriptsBody()}

  <script type='module' src='${config.ownStatic}/types/${type}/init.js'></script>

</body>

</html>
`


  return {
    resource
  }


}

module.exports = liveStudyLense
