'use strict';


const path = require('path');

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '..', "config");
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const serveIndex = require('serve-index');


const Logger = require('local-modules').logger;
const handleRequest = require('./handle-request.js');

const PORT = config.get('PORT');

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

process.on('uncaughtException', function onUncaughtException(e) {
  Logger.error('uncaughtException', e);
  process.exit(99);
});



const app = express()

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(handleRequest)

app.listen(PORT, err => {
  if (err) {
    Logger.error(`Failed to start server on port: ${PORT}`, err)
    process.exit(1)
  }

  Logger.info(`Server started successfully on port: ${PORT}`)
})
