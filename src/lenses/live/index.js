'use strict';

const fs = require('fs');

const detectType = require('./lib/detect-type.js');
const renderView = require('./lib/render-view.js');
const renderPath = require('local-modules').renderPath;
const compileConfig = require('./lib/compile-config.js');

const liveStudyLense = async (req, res, config) => {
  const { absPath, relPath, param } = config;

  const requestedADirectory = fs.existsSync(absPath) && fs.lstatSync(absPath).isDirectory();

  if (req.method === 'POST' && !requestedADirectory) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedBody = JSON.parse(body);
      fs.writeFile(absPath, parsedBody.code, 'utf-8', (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain;charset=UTF-8' });
          res.write(`Server error: ${error.code} ..`);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain;charset=UTF-8' });
          res.write('successfully saved ' + relPath, 'utf-8');
        }
      });
    });
    return { req, res };
  } else if (req.method === 'POST') {
    res.writeHead(500, { 'Content-Type': 'text/plain;charset=UTF-8' });
    res.write(`cannot POST to a directory`);
    return { req, res }
  };

  const type = detectType(absPath);

  const typePath = `${config.static.own}/types/${type}/index.js`;

  let defaultConfig = {};
  try {
    defaultConfig = require(`./static/types/${type}/config.js`);
  } catch (err) {
    console.log(err);
  };

  const liveStudyConfig = Object.assign({}, defaultConfig, compileConfig(absPath));
  liveStudyConfig.path = relPath;
  liveStudyConfig.type = type;
  liveStudyConfig.source = (await renderPath(config)).content;

  const view = renderView(type, config, liveStudyConfig);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(view, 'utf-8');

  return {
    req,
    res
  }
};

module.exports = liveStudyLense;
