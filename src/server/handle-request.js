const path = require('path');
const config = require('config');

const lenses = require('../lenses/index.js');
const fs = require('fs');
const { query } = require('express');
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

  // could not get this to work with express.static
  const staticMap = staticMaps.find(map => preRelPath.includes(map[0]));

  const relPath = staticMap
    ? preRelPath.replace(staticMap[0], staticMap[1])
    : preRelPath;
  const absPath = staticMap
    ? relPath
    : path.join(process.cwd(), relPath);


  // read the file/directory
  //  if unsuccessful, send response and return early
  const pathRendered = await renderPath({ absPath, relPath });

  if (pathRendered.error) {
    const errMsg = `Server error: ${error.code} ..`;
    res.writeHead(pathRendered.status);
    res.end(errMsg, 'utf-8');
    return;
  }


  if (pathRendered.status === 404) {
    res.writeHead(pathRendered.status, { 'Content-Type': pathRendered.mime });
    res.end(renderPath.content, 'utf-8');
    return;
  }


  /* will be an array like, in the order of the params:
    [
      {
        module: [AsyncFunction: liveStudyLense],
        name: 'live-study',
        static: {
          own: 'http://localhost:4600/own-resource-live-study',
          shared: 'http://localhost:4600/shared-resource'
        },
        queryValue: '1234'
      }
    ]
  */
  const queryKeys = Object.keys(req.query);

  const requestedLenses = queryKeys
    .map(queryKey => {
      try {
        const lense = lenses.find(lense => lense.name === queryKey);
        lense.query = req.query[lense.name];
        return lense;
      } catch (err) {
        console.log(err)
        return null;
      }
    })
    .filter(lense => lense !== null);


  const simpleRequest = {
    url: req.url,
    method: req.method,
    body: req.body,
    header: req.headers,
    cookies: req.cookies,
    query: req.query
  };

  let previousResource = {
    absPath,
    relPath,
    content: pathRendered.content,
    mime: pathRendered.mime,
    status: pathRendered.status
  };

  let nextResource = { ...previousResource };
  for (const lense of requestedLenses) {
    try {
      const config = {
        name: lense.name,
        query: lense.query,
        ownStatic: lense.static.own,
        sharedStatic: lense.static.shared,
      };


      const returnedResource = await lense.module(Object.assign({}, simpleRequest), nextResource, config);

      if (typeof returnedResource !== 'object' || returnedResource === previousResource) {
        nextResource = Object.assign({}, previousResource);
      } else {
        nextResource = Object.assign({}, previousResource, returnedResource);
      }

      if (typeof nextResource.content !== 'string') {
        throw new Error(lense.name + ': returned content must be a string');
      }
      if (typeof nextResource.mime !== 'string') {
        throw new Error(lense.name + ': returned mime must be a string');
      }
      if (isNaN(nextResource.status)) {
        throw new Error(lense.name + ': returned status must be numbery');
      }

    } catch (error) {
      Logger.error(error);
      console.log(error)
      // questionable?  fall back to sending raw content if there is an error in any lense
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`error in lense "${lense.name}", try removing this query from your URL`, 'utf-8');
      return;
    }
  }
  // console.log(didLense)

  res.writeHead(nextResource.status, { 'Content-Type': nextResource.mime });
  res.write(nextResource.content, 'utf-8');


  res.end();
};

module.exports = handleRequest;
