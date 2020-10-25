'use strict';

// start an express server, pretty standard stuff


// dependencies & config ...
const path = require('path');

const deepClone = require('./lib/deep-clone.js')

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '..', "config");

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// const defaultLocalsConfig = require('config').locals;

const changePerspective = require('./change-perspective')

const mime = require('mime')

// const Logger = require('../plugins/lenses/directory/node_modules/local-modules').logger;
const Logger = console
// const handleRequest = require('./handle-request/index.js');

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

app.use(/[\s\S]*own_static_lenses_resources/, express.static(path.join(__dirname, '..', 'lenses')))
app.use(/[\s\S]*own_static_options_resources/, express.static(path.join(__dirname, '..', 'options')))
app.use(/[\s\S]*shared_static_resources/, express.static(path.join(__dirname, '..', 'static')))
app.use(/[\s\S]*public_example_files/, express.static(path.join(__dirname, '..', 'public-example-files')))


const absolutePath = path.join(process.cwd(), requestPath);

app.use((req, res, next) => {
  if (Object.keys(req.query).length !== 0) {

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
      finalResource
    } = changePerspective({
      requestData,
      responseData
    })

    const mimeType = mime.getType(finalResource.info.ext)
    res.set('Content-Type', mimeType)
    res.status(finalResponseData.status)

    if (finalResponseData.headers) {
      for (const key of finalResponseData.headers) {
        res.set(key, finalResponseData.headers[key])
      }
    }

    if (finalResponseData.cookies) {
      for (const key of finalResponseData.cookies) {
        res.set(key, finalResponseData.cookies[key])
      }
    }

    res.send(finalResource.content)

  } else {
    next()
  }
})

/*
  if getting "/", serve
    index.html,
    or rendered README
  else
    next() - be a normal static server

*/

app.use('/', express.static(process.cwd()))


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
