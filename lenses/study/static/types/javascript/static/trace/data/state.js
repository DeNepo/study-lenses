"use strict";

export const state = {
  // this could contain objects with key/value pairs representing all variables in scope
  // or just arrays of strings for each variable name
  scopes: [],
  loggedSteps: 0,
};

// // can these objects reference a useful node or instrumented entity?

// class Variable {
//   type = "var" || "let" || "const";
//   value = "whatever";
//   name = "variable name";
// }

// class Scope {
//   locals = []; // all variables declared in the scope
// }

// class Block extends Scope {
//   label = "block name" || null;
// }

// class Lexical extends Scope {
//   name = "function name" || "anonymous";
//   closure = ["variable instances"];
//   this = {};
// }

// class Global extends Scope {} // maybe useful?

// class Step {
//   line = 0;
//   step = 0;
//   trap = "";
// }

// class History {}

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
