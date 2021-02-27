"use strict";

/*
  boolean configs for which language features will be traced
  defaults to only:
    - variables (and implicitly scop  e, by indentation)
    - errors (for more student-friendly error logs)
    at least once it's ready for use, in dev we use this file to configure
  all other options can be set in study.json
  or configured by the student from the UI

  note: all data types are always traced, that is not configurable
        they will also be deep-cloned before being logged
*/

export const config = {
  // default active options, the base needed for tracing data and mistakes
  variables: [],
  variablesDeclare: true,
  variablesAssign: true,
  variablesRead: true /* declare, assign, read.
                      passing true sets to these defaults
                      hosting should represented as step 0
                      function declarations fall under variables
                      how to visually differentiate block and lexical without too much clutter? */,
  failure: true, // (always)
  console: true, // (possible) enable/disable tracing calls to the console. for less clutter mostly
  interactions: true, // prompt/alert/confirm
  document: false, // the DOM, same as with console

  // core language features
  // blocks: true, // say if a new scope is block or lexical. if block label, log it
  // not doing blocks for now because for loops are complicated with JS and aran. read/write/assign is good enough atm
  // conditions: false, // how to handle switch/case vs. if/else? // see comment under blocks
  // loops: false, // how to handle different loop types // see comment under blocks
  controlFlow: false, // all occurrences of the 'test' trap, and break/continue
  functions: false, // name, args, return
  // replace the single functions with these two options
  functionsNative: true,
  functionsDefined: true,

  // advanceder options
  // locals: false, // nah, too much. entering debugger territory
  /* logs all variables that will be available in a scope (params, and local declarations. hosting + TDZ)
                  advanceder because it will add clutter */
  operators: false, // for stepping through operations & precedence
  this: false, // logs the this value at the top of each function call // yes, but later
  // closure: false, // logs a frame's closure values // nah, too much. entering debugger territory
  throw: false, // yes, but a little later

  // --- display settings ---
  lines: true,
  steps: true,
};
