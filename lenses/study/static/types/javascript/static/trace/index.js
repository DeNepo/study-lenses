"use strict";

import { pointcut } from "./pointcut.js";
import { state } from "./data/state.js";
import { aran } from "./setup.js";
import { config } from "./data/config.js";

window.trace = (code) => {
  state.scopeDepth = 1;
  state.blockLabels = [];
  state.loggedSteps = 0;

  const estree1 = Acorn.parse(code, { locations: true });
  // console.log(estree1);

  const estree2 = aran.weave(estree1, pointcut);
  // console.log(estree2);

  // const instrumented = "debugger;\n\n" + Astring.generate(estree2);
  const instrumented = Astring.generate(estree2);
  // console.log(instrumented);

  window.eval(instrumented);
};

trace.config = config;
