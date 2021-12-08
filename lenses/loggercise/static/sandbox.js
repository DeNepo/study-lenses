import { testRunner } from "./test-runner.js";

let iframe = document.createElement("iframe");

export const sandbox = {
  test: (func, tests, debug = false) => {
    try {
      document.body.removeChild(iframe);
    } catch (_) {}

    iframe = document.createElement("iframe");
    iframe.style = "display: none;";
    iframe.onload = () => {
      iframe.contentWindow.expect = expect;
      iframe.contentWindow.describe = describe;
      iframe.contentWindow.it = it;
      iframe.contentWindow.test = testRunner;
      iframe.contentWindow.tests = tests;
      iframe.contentWindow[func.name] = func;

      const testingScript = document.createElement("script");
      testingScript.innerHTML = `${debug ? "debugger;\n\n" : ""}test(${
        func.name
      }, tests);`;

      iframe.appendChild(testingScript);
    };

    document.body.appendChild(iframe);
  },
};
