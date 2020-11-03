export const studyWith = {
  console: function (code) {
    const execute = eval
    const stricted = "'use strict'; // in case you forgot ;) \n\n" + code;
    execute(stricted)
  },
  debugger: function (code) {
    const stepThrough = eval
    const debuggered = "debugger;\n\n'use strict'; // in case you forgot ;) \n\n" + code
    stepThrough(debuggered)
  },
  jsTutorLive: function (code) {
    const encodedJST = encodeURIComponent(code)
    const sanitizedJST = this.utils.sanitize(encodedJST)
    const jsTutorURL = "http://www.pythontutor.com/live.html#code=" + sanitizedJST + "&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false"
    window.open(jsTutorURL, '_blank')
  },
  jsTutor: function (code) {
    const encodedJST = encodeURIComponent(code)
    const sanitizedJST = this.utils.sanitize(encodedJST)
    const jsTutorURL = "http://www.pythontutor.com/visualize.html#code=" + sanitizedJST + "&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false"
    window.open(jsTutorURL, '_blank')
  },
  loupe: function (code) {
    const encoded = encodeURIComponent(btoa(code))
    const loupeURL = "http://latentflip.com/loupe/?code=" + encoded + "!!!"
    window.open(loupeURL, '_blank')
  },
  promisees: function (code) {
    const encoded = encodeURIComponent(code).replace(/%20/g, '+')
    const URL = "https://bevacqua.github.io/promisees/#code=" + encoded
    window.open(URL, '_blank')
  },
  esprima: function (code) {
    const encoded = encodeURIComponent(code)
    const URL = 'https://esprima.org/demo/parse.html?code=' + encoded
    window.open(URL, '_blank')
  },
  flowchart: function (code) {
    const lenseConfig = {
      code,
      ext: '.js'
    }
    const queryValue = encodeURIComponent(JSON.stringify(lenseConfig))
    const query = `?flowchart=${queryValue}`
    const url = window.location.origin + query
    window.open(url, '_blank')
  },
  utils: {
    sanitize: (str) => str
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/%09/g, '%20%20'),
    // large code, to be initialized when needed. ie. babel
    compressToBase64: null,
  }
}
