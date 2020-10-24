'use strict'

const fs = require('fs')
const mime = require('mime')
const path = require('path')
// const favicon = require('serve-favicon')

// const serveFavicon = favicon(path.join(__dirname, '..', '..', '..', 'static', 'favicon.ico'))

const compileResponse = ({ req, res, finalResponseData, finalResource, absolutePath }) => {


  // detect the mime type
  //  this can use some help
  let mimeType = ''
  if (finalResource.error) {
    // console.log(1)
    finalResource.content = `${finalResource.error.name}: ${finalResource.error.message}`
    mimeType = 'text/plain'
    finalResponseData.status = 500
  }
  else if (finalResource.content && typeof finalResource.content === 'object') {
    // console.log(2)
    // if the content is an object, send it as json
    mimeType = 'application/json'
  }
  else if (typeof finalResource.content === 'string' && finalResource.info.ext) {
    // console.log(3)
    // if there is a file name and content is a string
    //  deduce mime type from the file name
    mimeType = mime.getType(finalResource.info.ext)
  }
  else if (finalResource.content === null) {
    // console.log(4)
    finalResource.content = `<!DOCTYPE html><html><head><title>404</title></head><body><h1>404: ${req.path}</h1></body></html>`;
    mimeType = 'text/html'
    finalResponseData.status = 404
  }
  else {
    // console.log(5)
    // otherwise make sure the content is a string and send it as plain text
    finalResource.content = finalResource.content ? finalResource.content.toString() : String(finalResource.content)
    mimeType = 'text/plain'
  }

  // todo
  // assign the finalResponseData values to the acutal response
  //  transfer cookies using res.cookies()
  //  ...
  // not sure the most robust way to do this

  if (mimeType.includes('image') && finalResource.info.ext === path.extname(req.path)) {

    // only serve a resource as an image if it's original request path matches the final extension
    //   ie. flowchart, which renders code into an SVG. don't look for that file

    // https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs
    var s = fs.createReadStream(absolutePath);
    s.on('open', function () {
      res.set('Content-Type', mimeType);
      s.pipe(res);
    });
    // s.on('end', function () {
    //   res.set('Content-Type', mimeType);
    //   res.status(200)
    // });
    s.on('error', function () {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Not found'); // already did 404 checks
    });

  } else {
    res.set('Content-Type', mimeType)
    res.status(finalResponseData.status)
    res.send(finalResource.content)
  }

}

module.exports = compileResponse





// favicon start

  // if (finalResponseData.status === 404 && req.path.includes('favicon.ico')) {
  //   // if the user requested a favicon that was not in their repository
  //   //  default to this one


  //   // // https://github.com/expressjs/serve-favicon
  //   // serveFavicon(req, res, function onNext(err) {
  //   //   if (err) return done(err)
  //   // })

  //   // https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs
  //   var s = fs.createReadStream(path.join(__dirname, '..', '..', '..', 'static', 'favicon.ico'));
  //   s.on('open', function () {
  //     res.set('Content-Type', 'image/x-icon');
  //     s.pipe(res);
  //   });
  //   s.on('error', function () {
  //     res.set('Content-Type', 'text/plain');
  //     // res.status(404).end('Not found'); // already did 404 checks
  //   });

  // } else
