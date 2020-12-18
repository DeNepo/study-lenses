"use strict";

try {
  // does config exist and is it an object?
  config.property;

  Prism.plugins.toolbar.registerButton("js-tutor", function (env) {
    if (
      !(
        config.locals.openIn === "jsTutor" ||
        config.queryValue.openIn === "jsTutor"
      ) &&
      !(
        config.locals.openIn === "jsTutorLive" ||
        config.queryValue.openIn === "jsTutorLive"
      )
    ) {
      return null;
    }

    if (env.language !== "js" && env.language !== "javascript") {
      return null;
    }

    // const rootElement = env.element.parentElement;
    // if (!rootElement.hasAttribute('js-tutor')) {
    //   return null;
    // }

    const jsTutorButton = document.createElement("button");
    jsTutorButton.textContent = "js tutor";
    jsTutorButton.setAttribute("type", "button");
    jsTutorButton.addEventListener("click", () => {
      const encodedJST = encodeURIComponent(env.code);
      const sanitizedJST = encodedJST
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/%09/g, "%20%20");
      const jsTutorURL =
        "http://www.pythontutor.com/live.html#code=" +
        sanitizedJST +
        "&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";
      window.open(jsTutorURL, "_blank");
    });
    return jsTutorButton;
  });

  Prism.plugins.toolbar.registerButton("debug", function (env) {
    if (
      !(
        config.locals.eval ||
        config.locals.debug ||
        config.queryValue.eval ||
        config.queryValue.debug
      )
    ) {
      return null;
    }

    if (env.language !== "js" && env.language !== "javascript") {
      return null;
    }

    // const rootElement = env.element.parentElement;
    // if (!rootElement.hasAttribute('eval')) {
    //   return null;
    // }

    const debuggerButton = document.createElement("button");
    debuggerButton.textContent = "debug";
    debuggerButton.setAttribute("type", "button");
    debuggerButton.addEventListener("click", () =>
      eval("debugger;\n\n" + env.code)
    );
    return debuggerButton;
  });

  Prism.plugins.toolbar.registerButton("run", function (env) {
    if (
      !(
        config.locals.eval ||
        config.locals.run ||
        config.queryValue.eval ||
        config.queryValue.run
      )
    ) {
      return null;
    }

    if (env.language !== "js" && env.language !== "javascript") {
      return null;
    }
    // const rootElement = env.element.parentElement;
    // if (!rootElement.hasAttribute('eval')) {
    //   return null;
    // }

    const consoleButton = document.createElement("button");
    consoleButton.textContent = "run";
    consoleButton.setAttribute("type", "button");
    consoleButton.addEventListener("click", () => eval(env.code));
    return consoleButton;
  });

  Prism.plugins.toolbar.registerButton("flowchart", function (env) {
    if (!(config.locals.flowchart || config.queryValue.flowchart)) {
      return null;
    }

    if (env.language !== "js" && env.language !== "javascript") {
      return null;
    }

    const flowchartButton = document.createElement("button");
    flowchartButton.textContent = "flowchart";
    flowchartButton.setAttribute("type", "button");
    flowchartButton.addEventListener("click", () => {
      const pseudoResource = {
        resource: {
          content: env.code,
          info: { ext: ".js", base: "resource.js" },
        },
      };

      const stringifiedResource = encodeURIComponent(
        JSON.stringify(pseudoResource)
      );

      const query = "flowchart&--resource=" + stringifiedResource;
      const url = window.location.origin + "?" + query;
      window.open(url, "_blank");
    });
    return flowchartButton;
  });

  Prism.plugins.toolbar.registerButton("parsonize", function (env) {
    if (!(config.locals.parsons || config.queryValue.parsons)) {
      return null;
    }

    if (env.language !== "js" && env.language !== "javascript") {
      return null;
    }

    const parsonsButton = document.createElement("button");
    parsonsButton.textContent = "parsonize";
    parsonsButton.setAttribute("type", "button");
    parsonsButton.addEventListener("click", () => {
      const baseConfig = {
        code: env.code,
        ext: ".js",
      };
      const finalConfig = Object.assign(baseConfig, config.locals);
      const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
      const query = `?parsons=${queryValue}`;
      const url = window.location.origin + query;

      window.open(url, "_blank");
    });
    return parsonsButton;
  });

  Prism.plugins.toolbar.registerButton("flowchart", function (env) {
    if (!(config.locals.eval || config.queryValue.eval)) {
      return null;
    }

    if (env.language !== "js" && env.language !== "javascript") {
      return null;
    }

    const consoleButton = document.createElement("button");
    consoleButton.textContent = "flowchart";
    consoleButton.setAttribute("type", "button");
    consoleButton.addEventListener("click", () => {
      const baseConfig = {
        code: env.code,
        ext: ".js",
      };
      const finalConfig = Object.assign(baseConfig, config.locals);
      const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
      const query = `?flowchart=${queryValue}`;
      const url = window.location.origin + query;

      window.open(url, "_blank");
    });
    return consoleButton;
  });

  Prism.plugins.toolbar.registerButton("diff", function (env) {
    if (env.language !== "js" && env.language !== "javascript") {
      return null;
    }

    const parsonsButton = document.createElement("button");
    parsonsButton.textContent = "diff";
    parsonsButton.setAttribute("type", "button");
    parsonsButton.addEventListener("click", () => {
      const baseConfig = {
        code: env.code,
        ext: ".js",
      };
      const finalConfig = Object.assign(baseConfig, config.locals);
      const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
      const query = `?diff=${queryValue}`;
      const url = window.location.origin + query;

      window.open(url, "_blank");
    });
    return parsonsButton;
  });

  {
    const editify = (root, oldElement, code) => {
      const codeAlong = new CodeAlongComponent(
        code,
        Object.assign({}, config.queryValue, config.locals)
      );
      root.replaceChild(codeAlong, oldElement);
    };

    let codeAlongExists = false;
    try {
      new CodeAlongComponent();
      codeAlongExists = true;
    } catch (_) {}

    Prism.plugins.toolbar.registerButton("edit", function (env) {
      if (!codeAlongExists) {
        return null;
      }
      if (env.language !== "js" && env.language !== "javascript") {
        return null;
      }

      const editButton = document.createElement("button");
      editButton.textContent = "edit";
      editButton.setAttribute("type", "button");
      editButton.addEventListener("click", () =>
        editify(
          env.element.parentElement.parentElement.parentElement,
          env.element.parentElement.parentElement,
          env.code
        )
      );
      return editButton;
    });
  }
} catch (o_0) {}

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
