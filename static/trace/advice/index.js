"use strict";

import variables from "./variables.js";
import functions from "./functions.js";
import operators from "./operators.js";
import failure from "./failure.js";
import controlFlow from "./control-flow.js";

export const ADVICE = Object.assign(
  {},
  variables,
  functions,
  operators,
  failure,
  controlFlow
  // blocks,
  // debuggerStatement
);
