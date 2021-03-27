import { pointcut } from "./pointcut.js";
import { state } from "./data/state.js";

import { config } from "./data/config.js";
import { ADVICE } from "./advice/index.js";

import { walk } from "../estree-walker/index.js";
import { logHoisted } from "./lib/log-hoisted.js";

import { print } from "./lib/trace-log.js";

window.trace = (code) => {
  const iframe = document.createElement("iframe");
  iframe.onload = () => {
    iframe.contentWindow.ADVICE = ADVICE;

    iframe.contentWindow.aran = Aran({ namespace: "ADVICE" });
    const aran = iframe.contentWindow.aran;
    state.aran = iframe.contentWindow.aran;
    // iframe.contentWindow = new Proxy(iframe.contentWindow, {
    //   set: function (obj, prop, value) {
    //     console.log("set", prop);
    //     // The default behavior to store the value
    //     obj[prop] = value;

    //     // Indicate success
    //     return true;
    //   },
    //   get: function (obj, prop) {
    //     console.log("get", prop);
    //     return obj[prop];
    //   },
    // });
    state.window = iframe.contentWindow;
    // state.console = iframe.contentWindow.console;

    iframe.contentWindow.console = console;

    const settedUp = aran.setup();
    // console.log(settedUp);
    const generated = Astring.generate(settedUp);
    // console.log(generated);
    if (!iframe.contentWindow.ADVICE.builtins) {
      const setupScript = document.createElement("script");
      setupScript.innerHTML = generated;
      iframe.contentDocument.body.appendChild(setupScript);

      // iframe.contentWindow.eval(generated);
    }

    iframe.contentWindow.ADVICE.builtins.global.console = console;
    state.initialGlobals = Object.entries(
      iframe.contentWindow.ADVICE.builtins.global
    );
    // iframe.contentWindow.ADVICE.builtins.global = new Proxy(
    //   iframe.contentWindow.ADVICE.builtins.global,
    //   {
    //     set: function (obj, prop, value) {
    //       // if (
    //       //   !state.initialGlobals.find(
    //       //     (entry) => entry[0] === prop && Object.is(entry[1], value)
    //       //   )
    //       // ) {
    //       // const line = state.node.loc.start.line;
    //       // const col = state.node.loc.start.column;
    //       print({
    //         prefix: "",
    //         logs: [
    //           // (state.node.left ? state.node.left.name : variable) +
    //           "window." + prop + " (assign):",
    //           value,
    //         ],
    //       });
    //       // }
    //       // The default behavior to store the value
    //       obj[prop] = value;

    //       // Indicate success
    //       return true;
    //     },
    //     get: function (obj, prop) {
    //       const value = obj[prop];
    //       // if (!state.initialGlobals.find((entry) => entry[0] === prop)) {
    //       // const line = state.node.loc.start.line;
    //       // const col = state.node.loc.start.column;
    //       print({
    //         prefix: "",
    //         logs: [
    //           // (state.node.left ? state.node.left.name : variable) +
    //           "window." + prop + " (read):",
    //           value,
    //         ],
    //       });
    //       // }
    //       return value;
    //     },
    //   }
    // );

    iframe.contentWindow.trace = (code) => {
      state.scopeDepth = 1;
      state.blockLabels = [];
      state.loggedSteps = 0;
      state.callExpressions = [];

      state.code = code;

      let estree1;
      try {
        // estree1 = Acorn.parse("(() => {" + code + "})()", { locations: true });
        estree1 = Acorn.parse(code, { locations: true });
      } catch (err) {
        console.log(
          "%c" + err.name + ": ",
          "color:red; font-weight: bold;",
          err.message
        );
        console.log("-> creation phase");
        parentDocument.body.removeChild(iframe);
        return;
      }
      // console.log(estree1);

      // it's no good pausing in instrumented code
      // and you can't just remove debugger (line numbering)

      const deDebuggered = walk(estree1, {
        enter(node, parent, prop, index) {
          if (node.type === "CallExpression") {
            state.callExpressions.push(node);
          } else if (node.type === "DebuggerStatement") {
            // works even though null is shorter than debugger because of white-space insensitivity
            const nullNode = Acorn.parse("null").body[0];
            nullNode.start = node.start;
            nullNode.end = node.end;
            nullNode.expression.start = node.start;
            nullNode.expression.end = node.end;
            this.replace(nullNode);
          }
        },
      });
      // console.log(Astring.generate(deDebuggered));
      // console.log(deDebuggered);

      state.hoisted = [];
      let estree2 = aran.weave(deDebuggered, pointcut);
      // console.log(estree2);

      try {
        if (exercise.config.locals.loopGuard.active) {
          estree2 = insertLoopGuards(
            estree2,
            exercise.config.locals.loopGuard.max
          );
        }
        // console.log(estree2);
      } catch (o_0) {
        // console.error(o_0);
      }

      // const instrumented = "debugger;\n\n" + Astring.generate(estree2);
      const instrumented = Astring.generate(estree2);
      // console.log(instrumented);

      // console.log(state.hoisted);
      // logHoisted(state.hoisted);
      state.loggedSteps = 1;

      // if (returnCode) {
      //   return instrumented;
      // } else {
      try {
        iframe.contentWindow.eval(instrumented);
      } catch (o_0) {
        // console.error(o_0);
      }

      parentDocument.body.removeChild(iframe);

      // }
    };
    iframe.contentWindow.trace(code);
  };

  const parentDocument = document;
  document.body.appendChild(iframe);
};

window.traceConfig = config;
