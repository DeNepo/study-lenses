import variables from "./variables.js";
import functions from "./functions.js";
import operators from "./operators.js";
import exception from "./exception.js";
import blocks from "./blocks.js";
import erroring from "./error-handling.js";
import controlFlow from "./control-flow.js";

export const ADVICE = Object.assign(
  {},
  blocks,
  variables,
  functions,
  operators,
  exception,
  controlFlow,
  erroring
  // debuggerStatement
);
