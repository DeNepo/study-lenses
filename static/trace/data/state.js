const noTempValue = Symbol("no temp value");

export const state = {
  // this could contain objects with key/value pairs representing all variables in scope
  // or just arrays of strings for each variable name
  scopes: [],
  blockScopeDepth: 0,
  loggedSteps: 0,
  callExpressions: [],
  updateExpression: null || Node.type === "UPdateExpressions",
  updateTempValue: noTempValue,
  noTempValue,
  hoisted: [],
  aran: null, // an initialized aran instance
  firstInstrumentedCall: false,
  builtInEntryPoint: null,
  inConsoleCall: false,
};

// const e = {
//   variable: [() => {}, () => {}],
//   blocks: [() => {}, () => {}],
// };

// // will need to indicate transition
// states = [{...}, {...}]
// links = [{before:0, after:1, label:{type:"apply", this:{}, operator:"+"}}]

// reference back to serial and crawl up tree to see

// writing to a property is actually the apply trap, searching for Reflect.set
//  ie. "set the property" instead of "assign the property" - being vocabulariful
