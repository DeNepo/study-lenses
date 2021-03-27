const SymbolTag = Symbol("tag");
const SymbolLabels = Symbol("labels");
const SymbolStackLength = Symbol("stack-length");

// const aran = Aran({ format: "script" });
window.aran = Aran({ format: "script" });
const pointcut = (name, node) => true;
const print = (value) => {
  if (typeof value === "function") return value.name;
  return value;
};

let counter = 0;
let scope = undefined;
const scopeof = new WeakMap();
const callstack = [];
const stack = [];

let studentCode = "";
let transitions = [];
let states = [];

const step = ({ serial, args, advice }) => {
  // debugger;

  const node = state.aran.nodes[serial];
  const src = Astring.generate(node);

  states[states.length - 1].after = {
    advice,
    src,
  };
  const before = deepClone({
    i: states.length,
    before: {
      advice,
      src,
    },
    scope,
    callstack,
    scopeof,
    stack,
    node,
  });
  states.push(before);

  transitions[transitions.length - 1].after = before;
  transitions.push({
    i: transitions.length,
    advice,
    line: {
      src: studentCode.split("\n")[node.loc.start.line - 1],
      num: node.loc.start.line,
    },
    args,
    before,
    serial,
    node,
    src,
  });
};

const preAdvice = {};
const advice = new Proxy(preAdvice, {
  get(target, prop) {
    if (typeof preAdvice[prop] === "function") {
      return new Proxy(target[prop], {
        apply(target, thisValue, args) {
          step({
            advice: prop,
            serial: args[args.length - 1],
            args,
          });
          return target(...args);
        },
      });
    } else {
      return preAdvice[prop];
    }
  },
});

const nativeConsole = console;
const input = (name, value, serial) => {
  const shadow = ++counter;
  stack.push(shadow);
};
const output = (name, value, serial) => {
  stack.pop();
};

window[aran.namespace] = advice;
window.eval(aran.setup());

// --- begin: render functions for the history ---

const renderHistory = ({ transitions, states }) => {
  const historyNotProgram = {
    transitions: transitions.filter(
      (transition) => transition.node && transition.node.type !== "Program"
    ),
    states: states.filter(
      (state) => state.node && state.node.type !== "Program"
    ),
  };
  console.log(historyNotProgram);
  for (const transition of historyNotProgram.transitions) {
    if (
      transition.advice === "test" &&
      transition.node.type === "IfStatement"
    ) {
      console.log(transition.line.num + ": " + transition.line.src);
    }
  }
};

// --- end: render functions for the history ---

// --- the "exported" function ---

const newHistory = () => {
  const initialState = deepClone({
    i: 0,
    scope,
    callstack,
    scopeof,
    stack,
  });
  const states = [initialState];
  const transitions = [
    {
      i: 0,
      label: "initial",
      before: initialState,
    },
  ];
  return {
    states,
    transitions,
  };
};

window.shadowStateHistory = (script) => {
  const history = newHistory();
  transitions = history.transitions;
  states = history.states;

  studentCode = script;

  const originalTree = Acorn.parse(script, { locations: true });
  // const instrumented = aran.weave(deDebuggered, pointcut, null);
  const deDebuggered = walk(originalTree, {
    enter(node, parent, prop, index) {
      if (node.type === "DebuggerStatement") {
        this.remove();
      }
    },
    // leave(node, parent, prop, index) {
    //   // some code happens
    // },
  });
  // console.log(Astring.generate(deDebuggered));
  const instrumented = aran.weave(deDebuggered, pointcut, null);

  console.groupCollapsed("instrumented code");
  console.log(instrumented);
  console.groupEnd();

  eval(instrumented);

  renderHistory(history);
};
// --- --- --- --- --- --- --- ---

///////////////
// Producers //
///////////////

advice.primitive = (value, serial) => {
  // step({ value, serial });
  input("primitive", value, serial);
  return value;
};

advice.builtin = (value, name, serial) => {
  // step({ value, name, serial });
  input("builtin-(" + name + ")", value, serial);
  return value;
};

advice.closure = (value, serial) => {
  // step({ type: "closure", value, serial });
  scopeof.set(value, scope);
  input("closure", value, serial);
  return value;
};

advice.read = (value, identifier, serial) => {
  // step({ type: "read", value, identifier, serial });
  stack.push(scope[identifier]);
  return value;
};

advice.error = (value, serial) => {
  // step({ type: "error", value, serial });
  return value;
};

advice.argument = function (value, name, serial) {
  if (name === "length" || name === "new.target") {
    // step({ type: "argument", value, name, serial });
    input("argument-" + name, value, serial);
  }
  return value;
};

///////////////
// Consumers //
///////////////

advice.drop = (value, serial) => {
  // step({ type: "drop", value, serial });
  stack.pop();
  return value;
};

advice.write = (value, identifier, serial) => {
  // step({ type: "write", value, identifier, serial });
  let frame = scope;
  while (!Reflect.getOwnPropertyDescriptor(frame, identifier))
    frame = Reflect.getPrototypeOf(frame);
  frame[identifier] = stack.pop();
  return value;
};

advice.test = (value, serial) => {
  // step({ type: "test", value, serial });
  output("test", value, serial);
  return value;
};

advice.throw = (value, serial) => {
  // step({ type: "throw", value, serial });
  return value;
};

advice.eval = (value, serial) => {
  // step({ type: "eval", value, serial });
  output("eval", value, serial);
  return aran.weave(Acorn.parse(value), pointcut, serial);
};

advice.return = (value, serial) => {
  // step({ type: "return", value, serial });
  scope = callstack.pop();
  if (scope === undefined) output("return", value, null);
  return value;
};

advice.abrupt = (value, serial) => {
  // step({ type: "abrupt", value, serial });
  const shadow = stack.pop();
  while (scope[SymbolTag] !== "closure") scope = Reflect.getPrototypeOf(scope);
  while (stack.length > scope[SymbolStackLength]) stack.pop();
  scope = callstack.pop();
  if (scope !== undefined) stack.push(shadow);
  return value;
};

advice.success = (value, serial) => {
  // step({ type: "success", value, serial });
  scope = callstack.pop();
  return value;
};

advice.failure = (value, serial) => {
  // step({ type: "failure", value, serial });
  const shadow = stack.pop();
  while (scope[SymbolTag] !== "program") scope = Reflect.getPrototypeOf(scope);
  while (stack.length > scope[SymbolStackLength]) stack.pop();
  scope = callstack.pop();
  return output("failure", value, serial);
};

///////////////
// Informers //
///////////////

advice.debugger = (serial) => {
  // step({ type: "debugger", serial });
};

advice.program = (value, serial) => {
  // step({ type: "program", value, serial });
  callstack.push(scope);
  scope = null;
};

advice.arrival = (callee, newtarget, self, arguments, serial) => {
  if (scope === undefined) {
    for (let index = arguments.length - 1; index >= 0; index--) {
      input("arrival-argument-" + index, arguments[index], null);
    }
    if (newtarget === undefined) {
      input("arrival-this", self, null);
    }
  }
  callstack.push(scope);
  scope = scopeof.get(callee);
};

advice.enter = (tag, labels, identifiers, serial) => {
  if (tag === "catch") {
    const shadow = stack.pop();
    while (scope[SymbolTag] !== "try") scope = Reflect.getPrototypeOf(scope);
    while (stack.length > scope[SymbolStackLength]) stack.pop();
    stack.push(shadow);
    scope = Reflect.getPrototypeOf(scope);
  }
  scope = Object.create(scope);
  for (let index = 0; index < identifiers.length; index++)
    Reflect.defineProperty(scope, identifiers[index], { writable: true });
  if (tag === "program" || tag === "closure" || tag === "try")
    Reflect.defineProperty(scope, SymbolStackLength, { value: stack.length });
  Reflect.defineProperty(scope, SymbolTag, { value: tag });
  Reflect.defineProperty(scope, SymbolLabels, { value: labels });
};

advice.leave = (serial) => {
  scope = Reflect.getPrototypeOf(scope);
};

advice.continue = (label, serial) => {
  if (label) {
    while (!scope[SymbolLabels].includes(label)) {
      scope = Reflect.getPrototypeOf(scope);
    }
  } else {
    while (scope[SymbolTag] !== "loop") {
      scope = Reflect.getPrototypeOf(scope);
    }
  }
  scope = Reflect.getPrototypeOf(scope);
};

advice.break = (label, serial) => {
  if (label) {
    while (!scope[SymbolLabels].includes(label)) {
      scope = Reflect.getPrototypeOf(scope);
    }
  } else {
    while (scope[SymbolTag] !== "loop" && scope[SymbolTag] !== "switch") {
      scope = Reflect.getPrototypeOf(scope);
    }
  }
  scope = Reflect.getPrototypeOf(scope);
};

///////////////
// Combiners //
///////////////

advice.unary = function (operator, value, serial) {
  output("unary-argument-(" + operator + ")", value, serial);
  callstack.push(scope);
  scope = undefined;
  try {
    const result = aran.unary(operator, value, serial);
    input("unary-result-(" + operator + ")", result, serial);
    return result;
  } catch (error) {
    input("unary-error-(" + operator + ")", error, serial);
    throw error;
  } finally {
    scope = callstack.pop();
  }
};

advice.binary = function (operator, value1, value2, serial) {
  output("binary-right-(" + operator + ")", value2, serial);
  output("binary-left-(" + operator + ")", value1, serial);
  callstack.push(scope);
  scope = undefined;
  try {
    const result = aran.binary(operator, value1, value2);
    input("binary-result-(" + operator + ")", result, serial);
    return result;
  } catch (error) {
    input("binary-error-(" + operator + ")", error, stack);
    throw error;
  } finally {
    scope = callstack.pop();
  }
};

advice.apply = (value1, value2, values, serial) => {
  // console.log(serial, value1.name, aran.nodes[serial]);
  if (scopeof.has(value1)) {
    const shadows = values.length ? stack.splice(-values.length) : [];
    const shadow = stack.pop();
    output("apply-callee", value1, serial);
    stack.push(...shadows.reverse());
    stack.push(shadow);
    return Reflect.apply(value1, value2, values);
  }
  callstack.push(scope);
  scope = undefined;
  // let tempApplyAdvice = advice.apply;
  // const isConsoleCall = Object.values(nativeConsole).includes(value1);
  try {
    for (let index = values.length - 1; index >= 0; index--) {
      output("apply-argument-" + index, values[index], serial);
    }
    output("apply-this", value2, serial);
    output("apply-callee", value1, serial);
    // if (isConsoleCall) {
    //   advice.apply = () => {};
    // }
    const result = Reflect.apply(value1, value2, values);
    input("apply-result", result, serial);
    return result;
  } catch (error) {
    throw error;
  } finally {
    scope = callstack.pop();
  }
};

advice.construct = (value, values, serial) => {
  if (scopeof.has(value)) {
    const shadows = values.length ? stack.splice(-values.length) : [];
    output("construct-callee", value, serial);
    stack.push(...shadows.reverse());
    return Reflect.construct(value, values);
  }
  callstack.push(scope);
  scope = undefined;
  try {
    for (let index = values.length - 1; index >= 0; index--)
      output("construct-argument-" + index, values[index], serial);
    output("construct-callee", value, serial);
    const result = Reflect.construct(value, values);
    input("construct-result", result, serial);
    return result;
  } catch (error) {
    input("construct-error", error, serial);
    throw error;
  } finally {
    scope = callstack.pop();
  }
};
