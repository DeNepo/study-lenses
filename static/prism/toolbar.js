'use strict';

try {
  // does config exist and is it an object?

  config.property;

  const openWith = (code, lens, ext = '.js') => {
    const pseudoResource = {
      resource: {
        content: code,
        // hard-coding for now, assume this is only used with JS
        info: { ext, base: ext },
      },
    };

    const stringifiedResource = encodeURIComponent(
      JSON.stringify(pseudoResource),
    );

    const resourceQuery = `--resource=${stringifiedResource}`;

    const url = window.location.origin + `?${lens}&${resourceQuery}`;

    window.open(url, '_blank');
  };

  let evaller = null;
  const studyWithEval = (code, debug) => {
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
      if (config.locals.tests) {
        evaller.contentWindow.describe = describe;
        evaller.contentWindow.it = it;
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
        // script.innerHTML = "'use strict';\n\n" + finalCode;
      } else {
        // evalling in non-strict script so callstacks are consistent
        //  to avoid misconception that strict is fundamentally different
        script.innerHTML = `\neval(decodeURI(\`${encodeURI(finalCode)}\`));`;
      }

      evaller.contentDocument.body.appendChild(script);
    };
    document.body.appendChild(evaller);
  };

  Prism.plugins.toolbar.registerButton('run', function (env) {
    if (!(config.locals.eval || config.locals.run)) {
      return null;
    }

    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }
    // const rootElement = env.element.parentElement;
    // if (!rootElement.hasAttribute('eval')) {
    //   return null;
    // }

    const consoleButton = document.createElement('button');
    consoleButton.textContent = 'run';
    consoleButton.setAttribute('type', 'button');
    consoleButton.addEventListener('click', () => {
      studyWithEval(getLitCode(env.code));
    });
    return consoleButton;
  });

  Prism.plugins.toolbar.registerButton('debug', function (env) {
    if (!(config.locals.eval || config.locals.debug)) {
      return null;
    }

    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    // const rootElement = env.element.parentElement;
    // if (!rootElement.hasAttribute('eval')) {
    //   return null;
    // }

    const debuggerButton = document.createElement('button');
    debuggerButton.textContent = 'debug';
    debuggerButton.setAttribute('type', 'button');
    debuggerButton.addEventListener('click', () =>
      studyWithEval(getLitCode(env.code), true),
    );
    return debuggerButton;
  });

  Prism.plugins.toolbar.registerButton('trace', function (env) {
    if (!config.locals.trace) {
      return null;
    }

    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }
    // const rootElement = env.element.parentElement;
    // if (!rootElement.hasAttribute('eval')) {
    //   return null;
    // }

    const traceButton = document.createElement('button');
    traceButton.textContent = 'trace';
    traceButton.setAttribute('type', 'button');
    traceButton.addEventListener('click', () => {
      // debugger;
      trace(getLitCode(env.code));
    });
    return traceButton;
  });

  Prism.plugins.toolbar.registerButton('js-tutor', function (env) {
    if (
      !(config.locals.openIn === 'jsTutor') &&
      !(config.locals.openIn === 'jsTutorLive')
    ) {
      return null;
    }

    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    // const rootElement = env.element.parentElement;
    // if (!rootElement.hasAttribute('js-tutor')) {
    //   return null;
    // }

    const jsTutorButton = document.createElement('button');
    jsTutorButton.textContent = 'js tutor';
    jsTutorButton.setAttribute('type', 'button');
    jsTutorButton.addEventListener('click', () => {
      const encodedJST = encodeURIComponent(getLitCode(env.code));
      const sanitizedJST = encodedJST
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/%09/g, '%20%20');
      const jsTutorURL =
        'http://www.pythontutor.com/live.html#code=' +
        sanitizedJST +
        '&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false';
      window.open(jsTutorURL, '_blank');
    });
    return jsTutorButton;
  });

  Prism.plugins.toolbar.registerButton('variables', function (env) {
    if (!config.locals.variables) {
      return null;
    }

    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    const traceButton = document.createElement('button');
    traceButton.textContent = 'variables';
    traceButton.setAttribute('type', 'button');
    traceButton.addEventListener('click', () => {
      openWith(getLitCode(env.code), 'variables');
    });
    return traceButton;
  });

  Prism.plugins.toolbar.registerButton('highlight', function (env) {
    const parsonsButton = document.createElement('button');
    parsonsButton.textContent = 'highlight';
    parsonsButton.setAttribute('type', 'button');
    parsonsButton.addEventListener('click', () =>
      openWith(getLitCode(env.code), 'highlight'),
    );
    return parsonsButton;
  });

  Prism.plugins.toolbar.registerButton('flowchart', function (env) {
    if (!config.locals.flowchart) {
      return null;
    }

    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    const flowchartButton = document.createElement('button');
    flowchartButton.textContent = 'flowchart';
    flowchartButton.setAttribute('type', 'button');
    flowchartButton.addEventListener('click', () =>
      openWith(getLitCode(env.code), 'flowchart'),
    );
    return flowchartButton;
  });

  Prism.plugins.toolbar.registerButton('pseudo', function (env) {
    if (!config.locals.pseudo) {
      return null;
    }

    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    const pseudoButton = document.createElement('button');
    pseudoButton.textContent = 'pseudo';
    pseudoButton.setAttribute('type', 'button');
    pseudoButton.addEventListener('click', () =>
      openWith(getLitCode(env.code), 'pseudo&highlight'),
    );
    return pseudoButton;
  });

  Prism.plugins.toolbar.registerButton('parsonize', function (env) {
    if (!config.locals.parsons) {
      return null;
    }

    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    const parsonsButton = document.createElement('button');
    parsonsButton.textContent = 'parsonize';
    parsonsButton.setAttribute('type', 'button');
    parsonsButton.addEventListener('click', () =>
      openWith(getLitCode(env.code), 'parsons'),
    );
    return parsonsButton;
  });

  Prism.plugins.toolbar.registerButton('blanks', function (env) {
    if (!config.locals.blanks) {
      return null;
    }
    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    const blanksButton = document.createElement('button');
    blanksButton.textContent = 'blanks';
    blanksButton.setAttribute('type', 'button');
    blanksButton.addEventListener('click', () =>
      openWith(getLitCode(env.code), 'blanks'),
    );
    return blanksButton;
  });

  Prism.plugins.toolbar.registerButton('write me', function (env) {
    if (!config.locals.writeme) {
      return null;
    }
    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    const writemeButton = document.createElement('button');
    writemeButton.textContent = 'write me';
    writemeButton.setAttribute('type', 'button');
    writemeButton.addEventListener('click', () =>
      openWith(getLitCode(env.code), 'writeme'),
    );
    return writemeButton;
  });

  Prism.plugins.toolbar.registerButton('eslint', function (env) {
    if (!config.locals.writeme) {
      return null;
    }
    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    const eslintButton = document.createElement('button');
    eslintButton.textContent = 'eslint';
    eslintButton.setAttribute('type', 'button');
    eslintButton.addEventListener('click', () => {
      try {
        const code = getLitCode(env.code) + '\n'; // hacked for formatting differences with blocks vs. files
        const pseudoResource = {
          resource: {
            content: code,
            info: {
              ext: '.js',
              type: 'file',
            },
          },
        };
        // console.log(pseudoResource);

        const stringifiedResource = encodeURIComponent(
          JSON.stringify(pseudoResource),
        );

        const baseConfig = {
          code,
          ext: '.js',
        };
        // const queryValue = encodeURIComponent(JSON.stringify(baseConfig));
        const finalConfig = Object.assign(baseConfig, config);
        const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
        // if the full file is used, open lense with local configs from exercise
        //  otherwise don't, because anything syntax/runtime based will probably break for selections
        const url =
          window.location.origin +
          window.location.pathname +
          (queryValue
            ? `?eslint&--resource=${stringifiedResource}`
            : `?${queryKey}=${queryValue}&--resource=${stringifiedResource}`);

        fetch(url)
          .then((res) => res.text())
          .then((lintResult) => console.log(lintResult))
          .catch((err) => console.error(err));
      } catch (err) {
        console.error(err);
        console.log('--- eslint is not configured for this resource ---');
      }
    });
    return eslintButton;
  });

  Prism.plugins.toolbar.registerButton('new tab', function (env) {
    if (env.language !== 'html') {
      return null;
    }

    const newTabButton = document.createElement('button');
    newTabButton.textContent = 'new tab';
    newTabButton.setAttribute('type', 'button');
    newTabButton.addEventListener('click', () => {
      const x = window.open();
      x.document.open();
      x.document.write(getLitCode(env.code));
      x.document.close();
    });
    return newTabButton;
  });

  Prism.plugins.toolbar.registerButton('diff', function (env) {
    if (!config.locals.diff) {
      return null;
    }
    if (env.language !== 'js' && env.language !== 'javascript') {
      return null;
    }

    const parsonsButton = document.createElement('button');
    parsonsButton.textContent = 'diff';
    parsonsButton.setAttribute('type', 'button');
    parsonsButton.addEventListener('click', () =>
      openWith(getLitCode(env.code), 'diff'),
    );
    return parsonsButton;
  });

  {
    const editify = (root, oldElement, code) => {
      const codeAlong = new CodeAlongComponent(
        code,
        Object.assign({}, config.locals),
      );
      root.replaceChild(codeAlong, oldElement);
    };

    let codeAlongExists = false;
    try {
      new CodeAlongComponent();
      codeAlongExists = true;
    } catch (_) {}

    Prism.plugins.toolbar.registerButton('study', function (env) {
      if (!codeAlongExists) {
        return null;
      }
      if (
        env.language !== 'js' &&
        env.language !== 'javascript' &&
        env.language !== 'html' &&
        env.language !== 'html'
      ) {
        return null;
      }

      const ext =
        env.language === 'js' || env.language === 'javascript'
          ? '.js'
          : '.html';

      const editButton = document.createElement('button');
      editButton.textContent = 'study';
      editButton.setAttribute('type', 'button');
      editButton.addEventListener(
        'click',
        () => openWith(getLitCode(env.code), 'study', ext),
        // editify(
        //   env.element.parentElement.parentElement.parentElement,
        //   env.element.parentElement.parentElement,
        //   env.code
        // )
      );
      return editButton;
    });
  }

  const litProgram = Array.from(document.getElementsByTagName('pre'))
    .filter((pre) => !Array.from(pre.classList).includes('language-js'))
    .map((pre) => pre.innerText)
    .map((chunk, index) => `/* --- chunk ${index + 1} --- */\n\n${chunk}`)
    .join('\n');

  const isLit = config && config.inlines && config.inlines.literate;

  function getLitCode(code = '') {
    return isLit ? litProgram : code;
  }
} catch (o_0) {
  // console.error(o_0);
}

// Prism.plugins.toolbar.registerButton('copy', function (env) {

//   const copyButton = document.createElement('button');
//   copyButton.textContent = 'copy';
//   copyButton.setAttribute("type", "button");
//   copyButton.addEventListener('click', () => copy(env.code));

//   return copyButton;

//   function copy(code) {
//     if (!navigator.clipboard) {
//       fallbackCopyTextToClipboard(code);
//       return;
//     }
//     navigator.clipboard.writeText(code).then(function () {
//       // console.log('Async: Copying to clipboard was successful!');
//     }, function (err) {
//       // console.error('Async: Could not copy text: ', err);
//       fallbackCopyTextToClipboard(code);
//     });

//     function fallbackCopyTextToClipboard(text) {
//       var textArea = document.createElement("textarea");
//       textArea.value = text;
//       document.body.appendChild(textArea);
//       // textArea.focus();
//       textArea.select();
//       try {
//         var successful = document.execCommand('copy');
//         var msg = successful ? 'successful' : 'unsuccessful';
//         // console.log('Fallback: Copying text command was ' + msg);
//       } catch (err) {
//         console.error('Fallback: Oops, unable to copy', err);
//       }

//       document.body.removeChild(textArea);
//       // window.scrollTo(0, 0);
//     };

//     alert("copied code to clipboard");
//   }

// });
