const path = require('path');
const http = require('http');

const lenses = require('../lenses/index.js');
// const Logger = require('../lib/logger')

const renderPath = require('local-modules').renderPath;

const handleRequest = async (req, res) => {


  const relPath = req.path;
  const absPath = path.join(process.cwd(), relPath);
  // console.log(params)

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
  for (const lense of requestedLenses) {
    try {
      const config = {
        param: lense.config,
        absPath,
        relPath,
        // and find a better name for this property
        ownStatic: lense.ownStatic,
        sharedStatic: lense.sharedStatic
      };
      const { // in case a lense creates new instances
        newReq = req,
        newRes = res,
      } = await lense.module(req, res, config);

      if (newReq instanceof http.ClientRequest) {
        req = newReq;
      }
      if (newRes instanceof http.ServerResponse) {
        res = newRes;
      }
      didLense = true;
      usedLenses.push(lense.name);
    } catch (err) {
      didLense = false;
      // Logger.error(err);
      console.error(err);
    }
  }
  // console.log(didLense)

  if (!didLense) {
    try {
      const renderedPath = await renderPath({ absPath, relPath });
      if (renderedPath.error) {
        throw renderedPath.error;
      }
      res.writeHead(200, { 'Content-Type': renderedPath.mime.type });
      res.write(renderedPath.content, 'utf-8');
    } catch (err) {
      // Logger.error(err)
      console.error(err)
      const errMsg = `Server error: ${err.code} ..`;
      res.writeHead(500);
      res.end(errMsg);
      return;
    }
  };

  res.end();
};

module.exports = handleRequest;
