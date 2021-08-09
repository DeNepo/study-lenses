"use strict";

const btoa = (string) => Buffer.from(string).toString("base64");

const sanitize = (str) =>
  str.replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%09/g, "%20%20");

module.exports = {
  jsTutorLive: (code) => {
    const encodedJST = encodeURIComponent(code);
    const sanitizedJST = sanitize(encodedJST);
    const jsTutorURL =
      "http://www.pythontutor.com/live.html#code=" +
      sanitizedJST +
      "&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";
    return jsTutorURL;
  },
  jsTutor: (code) => {
    const encodedJST = encodeURIComponent(code);
    const sanitizedJST = sanitize(encodedJST);
    const jsTutorURL =
      "http://www.pythontutor.com/visualize.html#code=" +
      sanitizedJST +
      "&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";
    return jsTutorURL;
  },
  // algoviz: (code) => {
  //   return "https://algoviz.io/#/";
  // },
  "ui.dev": (code) => {
    const encodedJST = encodeURIComponent(code);
    const sanitizedJST = sanitize(encodedJST);
    const uiDevURL =
      "https://ui.dev/javascript-visualizer/?code=" + sanitizedJST;
    return uiDevURL;
  },
  jsv9000: (code) => {
    const encoded = encodeURIComponent(btoa(code));
    const jsvURL = "https://www.jsv9000.app/?code=" + encoded;
    return jsvURL;
  },
  loupe: (code) => {
    const encoded = encodeURIComponent(btoa(code));
    const loupeURL = "http://latentflip.com/loupe/?code=" + encoded + "!!!";
    return loupeURL;
  },
  promisees: (code) => {
    const encoded = encodeURIComponent(code).replace(/%20/g, "+");
    const URL = "https://bevacqua.github.io/promisees/#code=" + encoded;
    return URL;
  },
  esprima: (code) => {
    const encoded = encodeURIComponent(code);
    const URL = "https://esprima.org/demo/parse.html?code=" + encoded;
    return URL;
  },
};
