'use strict';

process.env['NODE_CONFIG_DIR'] = __dirname + "/config/"
const config = require('../config/default.js');
const express = require('express');
const morgan = require('morgan');
const serveIndex = require('serve-index');

const path = require('path');

// const Logger = require('./lib/logger')
const lenses = require('../lenses');
const handleRequest = require('./handle-request.js');

// const PORT = config.get('PORT');
const PORT = config.PORT;

process.on('exit', function onExit(code) {
  // Logger.info(`process.exit with code ${code}`);
  console.log(`process.exit with code ${code}`);
});

process.on('SIGINT', function onSIGINT() {
  // Logger.info('SIGINT received, stopping server');
  console.log('SIGINT received, stopping server');
  process.exit(0);
});

process.on('uncaughtException', function onUncaughtException(e) {
  // Logger.error('uncaughtException', e);
  console.error('uncaughtException', e);
  process.exit(99);
});

process.on('uncaughtException', function onUncaughtException(e) {
  // Logger.error('uncaughtException', e);
  console.error('uncaughtException', e);
  process.exit(99);
});

const app = express()

app.use(morgan('dev'))

app.use('/' + config.STATIC.shared, express.static(path.join(__dirname, '..', 'static')));
for (const lense of lenses) {
  app.use('/' + lense.ownStatic, express.static(path.join(__dirname, '..', 'lenses', lense.name, 'static')));
}
app.use(handleRequest)

app.listen(PORT, err => {
  if (err) {
    // Logger.error(`Failed to start server on port: ${PORT}`, err)
    console.error(`Failed to start server on port: ${PORT}`, err)
    process.exit(1)
  }

  // Logger.info(`Server started successfully on port: ${PORT}`)
  console.log(`Server started successfully on port: ${PORT}`)
})
