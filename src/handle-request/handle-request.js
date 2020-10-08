const path = require('path');
const http = require('http');

const lenses = require('../lenses/index.js');
const Logger = require('../lib/logger')

const staticise = require('./staticise.js');

const renderPath = require('local-modules').renderPath;

const handleRequest = async (req, res) => {

  const relPath = staticise(req.url.split('?')[0]);
  const absPath = path.join(process.cwd(), relPath);
  const params = req.url.split('?')[1];
  // console.log(params)

  const lenseParams = params
    ? params.split('&')
      .map(lenseParam => {
        const splitParam = lenseParam.split('=');
        if (splitParam.length === 2) {
          splitParam[1] === decodeURIComponent(splitParam[1]);
        };
        return splitParam;
      })
    : [];
  // console.log(lenseParams)

  const requestedLenses = lenseParams
    .map(lenseParam => {
      // close with serverConfig
      //  static prefix - lense-resource/${lenseParamName}
      return {
        logic: lenses[lenseParam[0]],
        name: lenseParam[0],
        config: lenseParam[1] || ''
      }
    });
  // console.log(loadedLenses);


  let usedLenses = []; // used for logging the req/res cycle
  let didLense = false; // used to determine if the file needs to be sent raw
  for (const lense of requestedLenses) {
    try {
      const config = {
        param: lense.config,
        absPath,
        relPath,
        // lense-resource should be server-config option
        // and find a better name for this property
        staticPrefix: 'lense-resource/' + lense.name
      };
      const {
        newReq = req,
        newRes = res,
      } = await lense.logic(req, res, config);

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
      Logger.error(err);
    }
  }
  // console.log(didLense)

  if (!didLense) {
    try {
      const renderedPath = await renderPath(absPath);
      if (renderedPath.error) {
        throw renderedPath.error;
      }
      res.writeHead(200, { 'Content-Type': renderedPath.mime.type });
      res.write(renderedPath.content, 'utf-8');
    } catch (err) {
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
