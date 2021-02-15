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

  const stricted = "'use strict';" + code;

  let estree1;
  try {
    estree1 = Acorn.parse(stricted, { locations: true });
  } catch (err) {
    console.log(
      "%c" + err.name + ": " + err.message,
      "color:red; font-weight: bold;"
    );
    return;
  }
  // console.log(estree1);
  // it's no good pausing in instrumented code
  const deDebuggered = walk(estree1, {
    enter(node, parent, prop, index) {
      if (node.type === "DebuggerStatement") {
        this.remove();
      }
    },
  });
  // console.log(Astring.generate(deDebuggered));

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
