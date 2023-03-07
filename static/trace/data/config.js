/*
  boolean configs for which language features will be traced
  defaults to only:
    - variables (and implicitly scop  e, by indentation)
    - errors (for more student-friendly error logs)
    at least once it's ready for use, in dev we use this file to configure
  all other options can be set in study.json or lenses.json
  or configured by the student from the UI

  note: all data types are always traced, that is not configurable
        they will also be deep-cloned before being logged
*/

export const config = {
  // --- variable tracing ---
  variablesList: [],
  variablesDeclare: true,
  variablesAssign: true,
  variablesRead: true /* declare, write, read.
                      passing true sets to these defaults
                      hosting should represented as step 0
                      function declarations fall under variables
                      how to visually differentiate block and lexical without too much clutter? */,

  // --- other options ---
  operatorsList: [],
  operators: true, // for stepping through operations & precedence

  controlFlowList: [],
  controlFlow: true, // all occurrences of the 'test' trap, and break/continue
  functionsList: [],
  functions: true,
  functionDeclarations: true,
  this: false, // logs the this value at the top of each function call
  errorHandling: true, // yes, but a little later: try/catch/finally, throw

  blockScope: false, // until the new Aran with finally blocks for leave

  // --- selected traces ---
  range: {
    start: 1,
    end: 1000,
  },

  // --- display settings ---
  lines: true,
  steps: true,
  console: true,
  isInRange: true, // toggled with each visit to the pointcut. will not work for async code

  // --- not configurable from the Ui ---
  failure: true,
};
