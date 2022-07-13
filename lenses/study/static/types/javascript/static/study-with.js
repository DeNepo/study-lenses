// "use strict";

import preBuffer from '/shared_static_resources/buffer.js';

const Buffer = preBuffer.Buffer;

let evaller = null;
const studyWithEval = (debug) => (code, tests) => {
  if (typeof code !== 'string') {
    // this should never happen, but just in case ....
    throw new TypeError('code is not a string');
  }
  // const trimmedFirstLine = code.trim().split("\n")[0].trim();
  // const firstLineIsUseStrict = /^['|"]use strict['|"]/.test(trimmedFirstLine);
  // const stricted =
  //   !firstLineIsUseStrict && debug
  //     ? "'use strict'; // you forgot ;) \n\n" + code
  //     : !firstLineIsUseStrict && !debug
  //     ? "'use strict'; /* you forgot ;) */  " + code
  //     : e;
  // const finalCode = debug ? "debugger;\n\n" + stricted : stricted;
  const finalCode = debug
    ? '/* ------------------------ */ debugger;\n\n\n\n\n' +
      code +
      '\n\n\n\n\n/* ------------------------ */ debugger;'
    : code;

  evaller = document.getElementById('evaller');
  if (evaller !== null) {
    document.body.removeChild(evaller);
  }

  evaller = document.createElement('iframe');
  evaller.style.display = 'none';
  evaller.id = 'evaller';

  evaller.onload = () => {
    if (config.locals.tests || tests) {
      // evaller.contentWindow.describe = describe;
      // evaller.contentWindow.it = it;

      describeItify(evaller.contentWindow);

      evaller.contentWindow.expect = expect;
    }

    const script = document.createElement('script');

    if (config.locals.type === 'module') {
      script.type = config.locals.type;
      script.innerHTML = finalCode;
    } else if (config.locals.strict) {
      script.innerHTML = `'use strict';\neval(decodeURI(\`${encodeURI(
        finalCode,
      )}\`));`;
      script.innerHTML = "'use strict';\n\n" + finalCode;
    } else {
      // evalling in non-strict script so callstacks are consistent
      //  to avoid misconception that strict is fundamentally different
      script.innerHTML = finalCode;
    }

    evaller.contentDocument.body.appendChild(script);
  };
  document.body.appendChild(evaller);
};

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
  console: studyWithEval(false),
  debugger: studyWithEval(true),
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
  algoviz: (code) => {
    alert(
      'your code is copied, you can paste it in algoviz after the site opens',
    );

    // https://stackoverflow.com/a/30810322
    // if (!navigator.clipboard) {
    var textArea = document.createElement('textarea');
    textArea.value = code;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
      window.open('_blank').location.href = 'https://algoviz.io/#/';
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  },
  'ui.dev': function (code) {
    const encodedJST = encodeURIComponent(code);
    const sanitizedJST = this.utils.sanitize(encodedJST);
    const uiDevURL =
      'https://ui.dev/javascript-visualizer/?code=' + sanitizedJST;
    window.open(uiDevURL, '_blank');
  },
  jsviz2: (code) => {
    const encoded = LZString.compressToEncodedURIComponent(code);
    const url = `https://jsviz2.klve.nl/#?code=${encoded}`;
    window.open(url, '_blank');
  },
  jsv9000: function (code) {
    const encoded = encodeURIComponent(btoa(code));
    const loupeURL = 'https://www.jsv9000.app/?code=' + encoded;
    window.open(loupeURL, '_blank');
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
  // flowchart: function (code) {
  //   const lenseConfig = {
  //     code,
  //     ext: ".js",
  //   };
  //   const queryValue = encodeURIComponent(JSON.stringify(lenseConfig));
  //   const query = `?flowchart=${queryValue}`;
  //   const url = window.location.origin + query;
  //   window.open(url, "_blank");
  // },
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
