const path = require('path');
const http = require('http');
const config = require('config');

const lenses = require('../lenses/index.js');
const Logger = require('local-modules').logger;

const renderPath = require('local-modules').renderPath;

const staticMaps = [
  [[config.STATIC.shared], path.join(__dirname, '..', 'static')],
  ...lenses.reduce((all, next) => {
    all.push([[`${config.STATIC.own}-${next.name}`], path.join(__dirname, '..', 'lenses', next.name, 'static')]);
    return all;
  }, [])
];

const handleRequest = async (req, res) => {

  const preRelPath = req.path;

  const staticMap = staticMaps.find(map => preRelPath.includes(map[0]));

  const relPath = staticMap
    ? preRelPath.replace(staticMap[0], staticMap[1])
    : preRelPath;
  const absPath = staticMap
    ? relPath
    : path.join(process.cwd(), relPath);

  const lenseParams = Object.entries(req.query);


  const requestedLenses = lenseParams
    .map(lenseParam => {
      const lense = lenses.find(next => next.name === lenseParam[0])
      if (typeof lense.module !== 'function') {
        return null;
      }
      lense.config = lenseParam[1];
      // close with serverConfig
      return lense;
    })
    .filter(item => item !== null);
  // console.log(loadedLenses);


  let usedLenses = []; // used for logging the req/res cycle
  let didLense = false; // used to determine if the file needs to be sent raw
  let packet = {}; // piped through successive lenses, for those that don't write a response
  for (const lense of requestedLenses) {
    try {
      const config = {
        param: lense.config,
        absPath,
        relPath,
        // and find a better name for this property
        static: lense.static
      };
      const { // in case a lense creates new req/res instances
        newReq = req,
        newRes = res,
        newPacket = packet
      } = await lense.module(req, res, config, packet);

      if (newReq instanceof http.ClientRequest) {
        req = newReq;
      }
      if (newRes instanceof http.ServerResponse) {
        res = newRes;
      }
      if (typeof newPacket === 'object') {
        packet = newPacket;
      }
      didLense = true;
      usedLenses.push(lense.name);
    } catch (err) {
      console.log(err)
      didLense = false;
      Logger.error(err);
    }
  }
  // console.log(didLense)

  // replace with a didWrite? if no write, send packet as json?
  if (!didLense) {
    try {
      const renderedPath = await renderPath({ absPath, relPath });
      if (renderedPath.error) {
        throw renderedPath.error;
      }
      res.writeHead(200, { 'Content-Type': renderedPath.mime.type });
      res.write(renderedPath.content, 'utf-8');
    } catch (err) {
      console.log(err)
      Logger.error(err)
      const errMsg = `Server error: ${err.code} ..`;
      res.writeHead(500);
      res.end(errMsg);
      return;
    }
  };

  res.end();
};

module.exports = handleRequest;
