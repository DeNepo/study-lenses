'use strict';

const http = require('http');

const handleRequest = require('./handle-request/handle-request.js');

const PORT = process.env.PORT || 1337;

const log = (msg) => {
  const cleanedMsg = msg.split(process.cwd()).join(' ... ');
  console.log(cleanedMsg);
};

const listeningCB = (err) => {
  if (err) {
    log(err.stack);
  } else {
    log('Server running at http://localhost:' + PORT + '/');
  };
}

http
  .createServer(handleRequest)
  .listen(PORT, listeningCB);

process.on('exit', function onExit(code) {
  log('process.exit with code ' + code);
});

process.on('SIGINT', function onSIGINT() {
  log('\nstopping server ...');
  process.exit(0);
});

process.on('uncaughtException', function onUncaughtException(e) {
  log('- uncaughtException -\n' + e.stack);
  process.exit(99);
});
