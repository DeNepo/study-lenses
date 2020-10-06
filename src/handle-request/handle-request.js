const path = require('path');
const http = require('http');

const staticise = require('./staticise.js');

const log = (msg) => {
  const cleanedMsg = msg.split(process.cwd()).join(' ... ').split(__dirname).join(' ... ');
  console.log(cleanedMsg);
};

const renderPath = require('local-modules').renderPath;

let cycles = 0;

const handleRequest = async (req, res) => {
  const cycle = ++cycles;

  log(`${cycle}. req: ${req.method} ${req.url}`);

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

  const loadedLenses = lenseParams
    .map(lenseParam => {
      try {
        const loaded = require(path.join(__dirname, '../lenses', lenseParam[0], 'index.js'));
        // close with serverConfig
        //  static prefix - lense-resource/${lenseParamName}
        return {
          loaded,
          name: lenseParam[0],
          config: lenseParam[1] || ''
        }
      } catch (err) {
        console.log(err)
        return null;
      }
    })
    .filter(item => item !== null);
  // console.log(loadedLenses);


  let lenses = []; // used for logging the req/res cycle
  let didLense = false; // used to determine if the file needs to be sent raw
  for (const lense of loadedLenses) {
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
      } = await lense.loaded(req, res, config);

      if (newReq instanceof http.ClientRequest) {
        req = newReq;
      }
      if (newRes instanceof http.ServerResponse) {
        res = newRes;
      }
      didLense = true;
      lenses.push(lense.name);
    } catch (err) {
      didLense = false;
      console.log(err);
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
      console.log(err)
      const errMsg = `Server error: ${err.code} ..`;
      res.writeHead(500);
      res.end(errMsg);
      return;
    }
  };

  res.end();

  log(cycle + '. res: ' + lenses.join(', ') + ': ' + relPath);
};

module.exports = handleRequest;
