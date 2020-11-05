'use strict';

// start an express server, pretty standard stuff


// dependencies & config ...
const path = require('path');
const fs = require('fs');
const util = require('util')
const readFilePromise = util.promisify(fs.readFile)

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '..', "config");
const config = require('config')
const localTopLevelConfigPath = path.join(process.cwd(), 'study.json')
if (fs.existsSync(localTopLevelConfigPath) && fs.lstatSync(localTopLevelConfigPath).isFile()) {
  try {
    const localTopLevelConfig = require(localTopLevelConfigPath)
    Object.assign(config.locals, localTopLevelConfig)
  } catch (err) {
    console.log(err)
  }
}

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mime = require('mime');
const marked = require('marked')

const deepClone = require('./lib/deep-clone.js')

const compileLocalConfigs = require('./compile-local-configs')
const resourceFromAbsolutePath = require('./resource-from-absolute-path')
const changePerspective = require('./change-perspective')
const loadPlugins = require('./load-plugins')

const optionsPath = path.join(__dirname, '..', 'options')
const optionsPromise = loadPlugins('options', optionsPath)

const lensesPath = path.join(__dirname, '..', 'lenses')
const lensesPromise = loadPlugins('lenses', lensesPath)

let localLensesPromise = null;
let localLensesPath = '';
let localLensesPathIsValid = false;
// console.log(config.locals)
if (typeof config.locals['--local-lenses'] === 'string') {
  // console.log(config.locals['--local-lenses'])
  localLensesPath = path.join(process.cwd(), config.locals['--local-lenses'])
  // console.log(localLensesPath)
  if (!fs.existsSync(localLensesPath) || !fs.lstatSync(localLensesPath).isFile()) {
    localLensesPathIsValid = true
    localLensesPromise = loadPlugins('local_lenses', localLensesPath)
    // localLensesPromise.then(console.log)
  } else {
    localLensesPath = ''
  }
}


const configurePlugins = require('./configure-plugins')


const Logger = require('./lib/logger.js');
// const Logger = console

// const PORT = config.get('PORT');
const PORT = 4600;


// error and exit handling ...
process.on('exit', function onExit(code) {
  Logger.info(`process.exit with code ${code}`);
});

process.on('SIGINT', function onSIGINT() {
  Logger.info('SIGINT received, stopping server');
  process.exit(0);
});

process.on('uncaughtException', function onUncaughtException(e) {
  Logger.error('uncaughtException', e);
  process.exit(99);
});

process.on('unhandledRejection', function onUnhandledPromise(e) {
  Logger.error('unhandledRejection', e);
  process.exit(99);
});


// initialize express ...
const app = express()

app.use(morgan('dev'))


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(/[\s\S]*own_static_resources_lenses/, express.static(path.join(__dirname, '..', 'lenses')))
app.use(/[\s\S]*own_static_resources_options/, express.static(path.join(__dirname, '..', 'options')))
app.use(/[\s\S]*shared_static_resources/, express.static(path.join(__dirname, '..', 'static')))
app.use(/[\s\S]*public_example_files/, express.static(path.join(__dirname, '..', 'public-example-files')))
if (localLensesPathIsValid) {
  app.use(/[\s\S]*own_static_resources_local_lenses/, express.static(localLensesPath))
}


app.use(async (req, res, next) => {

  // if there are no parameters, fall back to static serving
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 0) {
    next();
    return;
  }

  // if the 'ignore' option was send, fall back to static serving
  if (queryKeys.includes('--ignore')) {
    next();
    return;
  }

  // if the requested resource does not exist, fall back to static serving
  const absolutePath = path.join(process.cwd(), req.path);
  if (!fs.existsSync(absolutePath)) {
    next();
    return;
  }

  // build the local configuration for this request path
  //  all study.json combined from the request path
  //  up to the cwd, then the module's defaults
  const topLevelConfig = Object.assign({}, config.locals)
  const localConfigs = compileLocalConfigs(absolutePath, process.cwd(), topLevelConfig)

  // the there is a local --ignore option, fall back to static serving
  if (localConfigs['--ignore']) {
    next();
    return;
  }

  // filter for the requested plugins (url params)
  //  configure them with local & param configurations
  const options = configurePlugins((await optionsPromise), localConfigs, req.query)
  const lenses = []
  const builtinLenses = configurePlugins((await lensesPromise), localConfigs, req.query)
  if (builtinLenses) {
    lenses.push(...builtinLenses)
  }
  const localLenses = configurePlugins((await localLensesPromise), localConfigs, req.query)
  if (localLenses) {
    console.log(localLenses)
    lenses.push(...localLenses)
  }


  // if the parameters were not valid options or lenses
  //  fallback to static serving
  if (!options && !lenses) {
    next();
    return;
  }

  const resource = await resourceFromAbsolutePath({ absolutePath, localConfigs });

  // if there was an error fetching the resource
  //  fallback to static serving
  // express.static can handle the error
  if (resource.error) {
    next();
    return;
  }

  const requestData = {
    path: req.path,
    method: req.method,
    body: deepClone(req.body),
    headers: deepClone(req.headers),
    cookies: deepClone(req.cookies),
  }
  const responseData = {
    status: 200,
    headers: {},
    cookies: {},
    // body is not included
    //  it will be constructed from the finalResource
  }

  const {
    finalResponseData,
    finalResource,
    error, // not yet supported
  } = await changePerspective({
    lenses,
    options,
    resource,
    requestData,
    responseData,
  })

  // handle the error
  if (error) {
    // send?
    // fallback to static?
    return
  }

  const mimeType = mime.getType(finalResource.info.ext)
  res.set('Content-Type', mimeType)
  res.status(finalResponseData.status)

  if (finalResponseData.headers) {
    for (const key in finalResponseData.headers) {
      res.set(key, finalResponseData.headers[key])
    }
  }

  if (finalResponseData.cookies) {
    for (const key in finalResponseData.cookies) {
      res.set(key, finalResponseData.cookies[key])
    }
  }

  res.send(finalResource.content)

})


// if they requested a directory, send index.html or rendered README
// otherwise fallback to static serving (so 404)
app.use(async (req, res, next) => {
  // continue to static serving if it's not a directory
  const absolutePath = path.join(process.cwd(), req.path);
  const isDirectory = fs.existsSync(absolutePath) && fs.lstatSync(absolutePath).isDirectory()
  if (!isDirectory) {
    next()
    return
  }

  // send index.html if there is one
  const indexHtmlPath = path.join(absolutePath, 'index.html')
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = await readFilePromise(indexHtmlPath, 'utf-8')
    res.set('Content-Type', 'text/html')
    res.status(200)
    res.send(indexHtml)
    return
  }

  // render readme if there is one
  const readmeMdPath = path.join(absolutePath, 'readme.md')
  if (fs.existsSync(readmeMdPath)) {
    const rawMarkdown = await readFilePromise(readmeMdPath, 'utf-8')
    const renderedMarkdown = `
      <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="shared_static_resources/gh-styles.css">
          <link rel="stylesheet" href="shared_static_resources/prism/style.css">
        </head>
        <body>
          <main class="markdown-body">${marked(rawMarkdown)}</main>
          <script src="shared_static_resources/prism/script.js"></script>
        </body>
      </html>`
    res.set('Content-Type', 'text/html')
    res.status(200)
    res.end(renderedMarkdown)
    return
  }

  // // render something like a gitbook if there's a summary.md
  // todo

  // if there wasn't an index.html or a README, go on to static serving
  next()
})

// all-time fallback - be a static server from cwd
app.use(express.static(process.cwd()))


// launch the app
// to open browser after success
const serverPromise = new Promise((resolve, reject) => {
  app.listen(PORT, err => {
    if (err) {
      Logger.error(`Failed to start server on port: ${PORT}`, err)
      process.exit(1)
    }

    Logger.info(`Server started successfully on port: ${PORT}`)
    resolve()
  })
})

module.exports = serverPromise

/*
  go to ./handle-request/index.js for the next step in your journey
*/
