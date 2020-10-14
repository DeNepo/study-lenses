'use strict'

const mime = require('mime')

const compileResponse = ({ req, res, finalResponseData, finalResource }) => {

  // detect the mime type
  //  this can use some help
  let mimeType = ''
  if (finalResource.content && typeof finalResource.content === 'object') {
    // console.log(1)
    // if the content is an object, send it as json
    mimeType = 'application/json'
  }
  else if (typeof finalResource.content === 'string') {
    // console.log(2)
    // if there is a file name and content is a string
    //  deduce mime type from the file name
    mimeType = mime.getType(finalResource.info.ext)
  }
  else if (finalResource.error) {
    // console.log(3)
    console.log(finalResource.error)
    finalResource.content = `${finalResource.error.name}: ${finalResource.error.message}`
    mimeType = 'text/plain'
    finalResponseData.status = 500
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


  // assign the finalResponseData values to the acutal response
  //  transfer cookies using res.cookies()
  //  ...
  // not sure the most robust way to do this


  res.set('Content-Type', mimeType)
  // res.set('Content-Type', 'text/plain')
  res.status(finalResponseData.status)
  // res.status(200)

  res.send(finalResource.content)
  // res.send('hello')

}

module.exports = compileResponse
