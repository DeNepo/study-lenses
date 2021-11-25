// "use strict";

let evaller = null;
const studyWithEval = (debug) => (code, tests) => {
  if (typeof code !== "string") {
    // this should never happen, but just in case ....
    throw new TypeError("code is not a string");
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
    ? "/* ------------------------ */ debugger;\n\n\n\n\n" +
      code +
      "\n\n\n\n\n/* ------------------------ */ debugger;"
    : code;

  evaller = document.getElementById("evaller");
  if (evaller !== null) {
    document.body.removeChild(evaller);
  }

  evaller = document.createElement("iframe");
  evaller.style.display = "none";
  evaller.id = "evaller";

  evaller.onload = () => {
    if (config.locals.tests || tests) {
      // evaller.contentWindow.describe = describe;
      // evaller.contentWindow.it = it;

      describeItify(evaller.contentWindow);

      evaller.contentWindow.expect = expect;
    }

    const script = document.createElement("script");

    if (config.locals.type === "module") {
      script.type = config.locals.type;
      script.innerHTML = finalCode;
    } else if (config.locals.strict) {
      script.innerHTML = `'use strict';\neval(decodeURI(\`${encodeURI(
        finalCode
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
