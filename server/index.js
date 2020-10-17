'use strict';

// start an express server, pretty standard stuff


// dependencies & config ...
const path = require('path');

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '..', "config");
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// const Logger = require('../plugins/lenses/directory/node_modules/local-modules').logger;
const Logger = console
const handleRequest = require('./handle-request/index.js');

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

// this is where it all happens
app.use(handleRequest)


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
