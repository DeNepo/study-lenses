'use strict';

const btoa = (string) => Buffer.from(string).toString('base64');

const sanitize = (str) =>
  str.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%09/g, '%20%20');

const jsTutor = function (code) {
  const encodedJST = encodeURIComponent(code);
  const sanitizedJST = sanitize(encodedJST);
  const jsTutorURL =
    // 'http://www.pythontutor.com/visualize.html#code=' +
    'http://www.pythontutor.com/iframe-embed.html#code=' +
    sanitizedJST +
    '&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false';
  return jsTutorURL;
};

module.exports = {
  jstutorlive: jsTutor,
  jstutor: jsTutor,
  learnwithtrace: function (code) {
    const mainedCode = `export const main = () => {\n\n${code}\n\n};`;
    const lwtURL = createTracePlaygroundUrlForCode(mainedCode);
    return lwtURL;
  },
  // algoviz: (code) => {
  //   return "https://algoviz.io/#/";
  // },
  'ui.dev': (code) => {
    const encodedJST = encodeURIComponent(code);
    const sanitizedJST = sanitize(encodedJST);
    const uiDevURL =
      'https://ui.dev/javascript-visualizer/?code=' + sanitizedJST;
    return uiDevURL;
  },
  jsv9000: (code) => {
    const encoded = encodeURIComponent(btoa(code));
    const jsvURL = 'https://www.jsv9000.app/?code=' + encoded;
    return jsvURL;
  },
  loupe: (code) => {
    const encoded = encodeURIComponent(btoa(code));
    const loupeURL = 'http://latentflip.com/loupe/?code=' + encoded + '!!!';
    return loupeURL;
  },
  promisees: (code) => {
    const encoded = encodeURIComponent(code).replace(/%20/g, '+');
    const URL = 'https://bevacqua.github.io/promisees/#code=' + encoded;
    return URL;
  },
  esprima: (code) => {
    const encoded = encodeURIComponent(code);
    const URL = 'https://esprima.org/demo/parse.html?code=' + encoded;
    return URL;
  },
};

// --- for learnWithTrace ---
function createTracePlaygroundUrlForCode(code) {
  const url = new URL('https://www.learnwithtrace.com/playground/code');

  // if (options.isEmbed) {
  url.searchParams.append('embed', 'false');
  // }
  url.searchParams.append('files', createTraceFilesParam(code));
  url.searchParams.append('language', 'javascript');
  url.searchParams.append('hideReadonlyFiles', 'true');

  return url.toString();
}
function createTraceFilesParam(code) {
  const payload = {
    version: 0,
    files: [
      {
        version: 0,
        filename: 'main.js',
        directory: 'src',
        contents: code,
        editable: true,
      },
    ],
  };
  const stringified = JSON.stringify(payload);
  const encoded = encodeURIComponent(
    Buffer.from(stringified).toString('base64'),
  );
  return encoded;
}
