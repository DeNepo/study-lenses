import preBuffer from '../buffer.js';

const Buffer = preBuffer.Buffer;

const jsTutor = function (code) {
  const encodedJST = encodeURIComponent(code);
  const sanitizedJST = this.utils.sanitize(encodedJST);
  const jsTutorURL =
    // 'http://www.pythontutor.com/visualize.html#code=' +
    'http://www.pythontutor.com/iframe-embed.html#code=' +
    sanitizedJST +
    '&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false';
  window.open(jsTutorURL, '_blank');
};

export const studyWith = {
  // live editor is deprecated
  // jsTutorLive: function (code) {
  //   const encodedJST = encodeURIComponent(code);
  //   const sanitizedJST = this.utils.sanitize(encodedJST);
  //   const jsTutorURL =
  //     'http://www.pythontutor.com/live.html#code=' +
  //     sanitizedJST +
  //     '&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false';
  //   window.open(jsTutorURL, '_blank');
  // },
  // preserve jsTutorLive config option to not break old study.json files
  jsTutorLive: jsTutor,
  jsTutor,
  learnWithTrace: function (code) {
    const mainedCode = `export const main = () => {\n\n${code}\n\n};`;
    const lwtURL = createTracePlaygroundUrlForCode(mainedCode);
    window.open(lwtURL, '_blank');
  },
  learnWithTrace: function (code) {
    const mainedCode = `export const main = () => {\n\n${code}\n\n};`;
    const lwtURL = createTracePlaygroundUrlForCode(mainedCode);
    window.open(lwtURL, '_blank');
  },
  loupe: function (code) {
    const encoded = encodeURIComponent(btoa(code));
    const loupeURL = 'http://latentflip.com/loupe/?code=' + encoded + '!!!';
    window.open(loupeURL, '_blank');
  },
  promisees: function (code) {
    const encoded = encodeURIComponent(code).replace(/%20/g, '+');
    const URL = 'https://bevacqua.github.io/promisees/#code=' + encoded;
    window.open(URL, '_blank');
  },
  esprima: function (code) {
    const encoded = encodeURIComponent(code);
    const URL = 'https://esprima.org/demo/parse.html?code=' + encoded;
    window.open(URL, '_blank');
  },
  flowchart: function (code) {
    const lenseConfig = {
      code,
      ext: '.js',
    };
    const queryValue = encodeURIComponent(JSON.stringify(lenseConfig));
    const query = `?flowchart=${queryValue}`;
    const url = window.location.origin + query;
    window.open(url, '_blank');
  },
  utils: {
    sanitize: (str) =>
      str.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%09/g, '%20%20'),
    // large code, to be initialized when needed. ie. babel
    compressToBase64: null,
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
