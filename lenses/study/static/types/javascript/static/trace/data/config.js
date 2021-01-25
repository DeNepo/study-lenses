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
  variables: true /* declare, assign, read. hosting is represented as step 0
                      function declarations fall under variables
                      how to visually differentiate block and lexical without too much clutter? */,
  error: true,
  console: false, // enable/disable tracing calls to the console. for less clutter mostly

  // core language features
  blocks: true, // say if a new scope is block or lexical. if block label, log it
  conditions: false, // how to handle switch/case vs. if/else?
  loops: false, // how to handle different loop types
  breakContinue: false, // add an extra line to the trace for break/continue
  functions: false, // name, args, return

  // advanceder options
  locals: false /* logs all variables that will be available in a scope (params, and local declarations. hosting + TDZ)
                  advanceder because it will add clutter */,
  operators: false, // for stepping through operations & precedence
  this: false, // logs the this value at the top of each function call
  closure: false, // logs a frame's closure values
  throw: false,

  // --- display settings ---
  lines: true,
  steps: true,
};
