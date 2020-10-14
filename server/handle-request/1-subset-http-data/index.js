'use strict'

const deepClone = require('../lib/deep-clone.js')

const subsetHttpData = (req, res) => {

  /* a copy of the data provided in the HTTP request
     this will be available to lenses and options when the resource is processed */
  const requestData = {
    path: req.path,
    method: req.method,
    body: deepClone(req.body),
    headers: deepClone(req.headers),
    cookies: deepClone(req.cookies),
  }

  /* a copy of the data to be written in the HTTP response
    this will be available to lenses and options when the resource is processed */
  const responseData = {
    status: 200,
    headers: {},
    cookies: {},
  }

  return {
    responseData,
    requestData
  }

}


module.exports = subsetHttpData
