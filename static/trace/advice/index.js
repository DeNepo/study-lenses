"use strict";

import variables from "./variables.js";
import functions from "./functions.js";
import error from "./error.js";
import blocks from "./blocks.js";
import debuggerStatement from "./debugger-statement.js";

export const ADVICE = Object.assign(
  {},
  variables,
  functions,
  error
  // blocks,
  // debuggerStatement
);
