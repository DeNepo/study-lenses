"use strict";

import { pointcut } from "./pointcut.js";
import { state } from "./data/state.js";
import { aran } from "./setup.js";
import { config } from "./data/config.js";

import { walk } from "./lib/estree-walker/index.js";

window.walk = walk;

window.trace = (code) => {
  state.scopeDepth = 1;
  state.blockLabels = [];
  state.loggedSteps = 0;
  state.callExpressions = [];

  state.code = code;

  let estree1;
  try {
    estree1 = Acorn.parse(code, { locations: true });
  } catch (err) {
    console.log(
      "%c" + err.name + ": " + err.message,
      "color:red; font-weight: bold;"
    );
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

  const estree2 = aran.weave(deDebuggered, pointcut);
  // console.log(estree2);

  // const instrumented = "debugger;\n\n" + Astring.generate(estree2);
  const instrumented = Astring.generate(estree2);
  // console.log(instrumented);

  try {
    window.eval(instrumented);
  } catch (o_0) {}
};

trace.config = config;
