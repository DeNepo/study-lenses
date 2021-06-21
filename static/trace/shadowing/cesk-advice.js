// waay too long signature, needs work
const ceskAdviceSignature = (
  adviceName,
  userAdvice,
  userPointcut,
  history,
  aran
) => (...args) => {
  const node = state.aran.nodes[serial];
  // do your cesky thing, use history
  if (typeof userAdvice === "function" && userPointcut(adviceName, node)) {
    value = userAdvice(...args);
  }
  // do your cesky thing
  return value; // if necessary
};

const SymbolTag = Symbol("tag");
const SymbolLabels = Symbol("labels");
const SymbolStackLength = Symbol("stack-length");

const ceskState = {
  counter: 0,
  scope: undefined,
  scopeof: new WeakMap(),
  callstack: [],
  stack: [],
};

const ceskAdvice = {};

const input = (name, value, serial) => {
  const shadow = ++counter;
  ceskState.stack.push(shadow);
};
const output = (name, value, serial) => {
  ceskState.stack.pop();
};

///////////////
// Producers //
///////////////

ceskAdvice.primitive = (advice) => (value, serial) => {
  input("primitive", value, serial);
  return typeof advice === "function" ? advice(value, serial) : value;
};

ceskAdvice.builtin = (advice) => (value, name, serial) => {
  input("builtin-(" + name + ")", value, serial);
  return typeof advice === "function" ? advice(value, name, serial) : value;
};

ceskAdvice.closure = (advice) => (value, serial) => {
  ceskState.scopeof.set(value, scope);
  input("closure", value, serial);
  return value;
};

ceskAdvice.read = (advice) => (value, identifier, serial) => {
  // step({ type: "read", value, identifier, serial });
  ceskState.stack.push(scope[identifier]);
  return value;
};

ceskAdvice.error = (advice) => (value, serial) => {
  // step({ type: "error", value, serial });
  return value;
};

ceskAdvice.argument = (advice) =>
  function (value, name, serial) {
    if (name === "length" || name === "new.target") {
      // step({ type: "argument", value, name, serial });
      input("argument-" + name, value, serial);
    }
    return value;
  };

///////////////
// Consumers //
///////////////

ceskAdvice.drop = (advice) => (value, serial) => {
  // step({ type: "drop", value, serial });
  ceskState.stack.pop();
  return value;
};

ceskAdvice.write = (advice) => (value, identifier, serial) => {
  // step({ type: "write", value, identifier, serial });
  let frame = scope;
  while (!Reflect.getOwnPropertyDescriptor(frame, identifier))
    frame = Reflect.getPrototypeOf(frame);
  frame[identifier] = ceskState.stack.pop();
  return value;
};

ceskAdvice.test = (advice) => (value, serial) => {
  // step({ type: "test", value, serial });
  output("test", value, serial);
  return value;
};

ceskAdvice.throw = (advice) => (value, serial) => {
  // step({ type: "throw", value, serial });
  return value;
};

ceskAdvice.eval = (advice) => (value, serial) => {
  // step({ type: "eval", value, serial });
  output("eval", value, serial);
  return aran.weave(Acorn.parse(value), pointcut, serial);
};

ceskAdvice.return = (advice) => (value, serial) => {
  // step({ type: "return", value, serial });
  ceskState.scope = ceskState.callstack.pop();
  if (ceskState.scope === undefined) output("return", value, null);
  return value;
};

ceskAdvice.abrupt = (advice) => (value, serial) => {
  // step({ type: "abrupt", value, serial });
  const shadow = ceskState.stack.pop();
  while (scope[SymbolTag] !== "closure")
    ceskState.scope = Reflect.getPrototypeOf(scope);
  while (ceskState.stack.length > scope[SymbolStackLength])
    ceskState.stack.pop();
  ceskState.scope = ceskState.callstack.pop();
  if (scope !== undefined) ceskState.stack.push(shadow);
  return value;
};

ceskAdvice.success = (advice) => (value, serial) => {
  // step({ type: "success", value, serial });
  ceskState.scope = ceskState.callstack.pop();
  return value;
};

ceskAdvice.failure = (advice) => (value, serial) => {
  // step({ type: "failure", value, serial });
  const shadow = ceskState.stack.pop();
  while (scope[SymbolTag] !== "program")
    ceskState.scope = Reflect.getPrototypeOf(scope);
  while (ceskState.stack.length > scope[SymbolStackLength])
    ceskState.stack.pop();
  ceskState.scope = ceskState.callstack.pop();
  return output("failure", value, serial);
};

///////////////
// Informers //
///////////////

ceskAdvice.debugger = (advice) => (serial) => {
  // step({ type: "debugger", serial });
};

ceskAdvice.program = (advice) => (value, serial) => {
  // step({ type: "program", value, serial });
  ceskState.callstack.push(scope);
  ceskState.scope = null;
};

ceskAdvice.arrival = (advice) => (
  callee,
  newtarget,
  self,
  arguments,
  serial
) => {
  if (ceskState.scope === undefined) {
    for (let index = arguments.length - 1; index >= 0; index--) {
      input("arrival-argument-" + index, arguments[index], null);
    }
    if (newtarget === undefined) {
      input("arrival-this", self, null);
    }
  }
  ceskState.callstack.push(scope);
  ceskState.scope = ceskState.scopeof.get(callee);
};

ceskAdvice.enter = (advice) => (tag, labels, identifiers, serial) => {
  if (tag === "catch") {
    const shadow = ceskState.stack.pop();
    while (scope[SymbolTag] !== "try")
      ceskState.scope = Reflect.getPrototypeOf(scope);
    while (ceskState.stack.length > scope[SymbolStackLength])
      ceskState.stack.pop();
    ceskState.stack.push(shadow);
    ceskState.scope = Reflect.getPrototypeOf(scope);
  }
  ceskState.scope = Object.create(scope);
  for (let index = 0; index < identifiers.length; index++)
    Reflect.defineProperty(scope, identifiers[index], { writable: true });
  if (tag === "program" || tag === "closure" || tag === "try")
    Reflect.defineProperty(scope, SymbolStackLength, {
      value: ceskState.stack.length,
    });
  Reflect.defineProperty(scope, SymbolTag, { value: tag });
  Reflect.defineProperty(scope, SymbolLabels, { value: labels });
};

ceskAdvice.leave = (advice) => (serial) => {
  ceskState.scope = Reflect.getPrototypeOf(scope);
};

ceskAdvice.continue = (advice) => (label, serial) => {
  if (label) {
    while (!scope[SymbolLabels].includes(label)) {
      ceskState.scope = Reflect.getPrototypeOf(scope);
    }
  } else {
    while (scope[SymbolTag] !== "loop") {
      ceskState.scope = Reflect.getPrototypeOf(scope);
    }
  }
  ceskState.scope = Reflect.getPrototypeOf(scope);
};

ceskAdvice.break = (advice) => (label, serial) => {
  if (label) {
    while (!scope[SymbolLabels].includes(label)) {
      ceskState.scope = Reflect.getPrototypeOf(scope);
    }
  } else {
    while (scope[SymbolTag] !== "loop" && scope[SymbolTag] !== "switch") {
      ceskState.scope = Reflect.getPrototypeOf(scope);
    }
  }
  ceskState.scope = Reflect.getPrototypeOf(scope);
};

///////////////
// Combiners //
///////////////

ceskAdvice.unary = (advice) =>
  function (operator, value, serial) {
    output("unary-argument-(" + operator + ")", value, serial);
    ceskState.callstack.push(scope);
    ceskState.scope = undefined;
    try {
      const result = aran.unary(operator, value, serial);
      input("unary-result-(" + operator + ")", result, serial);
      return result;
    } catch (error) {
      input("unary-error-(" + operator + ")", error, serial);
      throw error;
    } finally {
      ceskState.scope = ceskState.callstack.pop();
    }
  };

ceskAdvice.binary = (advice) =>
  function (operator, value1, value2, serial) {
    output("binary-right-(" + operator + ")", value2, serial);
    output("binary-left-(" + operator + ")", value1, serial);
    ceskState.callstack.push(scope);
    ceskState.scope = undefined;
    try {
      const result = aran.binary(operator, value1, value2);
      input("binary-result-(" + operator + ")", result, serial);
      return result;
    } catch (error) {
      input("binary-error-(" + operator + ")", error, stack);
      throw error;
    } finally {
      ceskState.scope = ceskState.callstack.pop();
    }
  };

ceskAdvice.apply = (advice) => (value1, value2, values, serial) => {
  // console.log(serial, value1.name, aran.nodes[serial]);
  if (ceskState.scopeof.has(value1)) {
    const shadows = values.length ? ceskState.stack.splice(-values.length) : [];
    const shadow = ceskState.stack.pop();
    output("apply-callee", value1, serial);
    ceskState.stack.push(...shadows.reverse());
    ceskState.stack.push(shadow);
    return Reflect.apply(value1, value2, values);
  }
  ceskState.callstack.push(scope);
  ceskState.scope = undefined;
  // let tempApplyAdvice = ceskAdvice.apply;
  // const isConsoleCall = Object.values(nativeConsole).includes(value1);
  try {
    for (let index = values.length - 1; index >= 0; index--) {
      output("apply-argument-" + index, values[index], serial);
    }
    output("apply-this", value2, serial);
    output("apply-callee", value1, serial);
    // if (isConsoleCall) {
    //   ceskAdvice.apply = () => {};
    // }
    const result = Reflect.apply(value1, value2, values);
    input("apply-result", result, serial);
    return result;
  } catch (error) {
    throw error;
  } finally {
    ceskState.scope = ceskState.callstack.pop();
  }
};

ceskAdvice.construct = (advice) => (value, values, serial) => {
  if (ceskState.scopeof.has(value)) {
    const shadows = values.length ? ceskState.stack.splice(-values.length) : [];
    output("construct-callee", value, serial);
    ceskState.stack.push(...shadows.reverse());
    return Reflect.construct(value, values);
  }
  ceskState.callstack.push(scope);
  ceskState.scope = undefined;
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
    ceskState.scope = ceskState.callstack.pop();
  }
};

export { ceskAdvice, ceskState };
