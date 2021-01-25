"use strict";

export const state = {
  // this could contain objects with key/value pairs representing all variables in scope
  // or just arrays of strings for each variable name
  scopes: [],
  loggedSteps: 0,
};

// can these objects reference a useful node or instrumented entity?

class Scope {
  locals = []; // all variables declared in the scope
}

class Block extends Scope {
  label = "block name" || null;
}

class Lexical extends Scope {
  name = "function name" || "anonymous";
  closure = ["variable instances"];
  this = {};
}

class Global extends Scope {} // maybe useful?

class Variable {
  type = "var" || "let" || "const";
  value = "whatever";
  name = "variable name";
}
