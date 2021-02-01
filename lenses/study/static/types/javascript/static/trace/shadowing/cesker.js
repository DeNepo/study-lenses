"use strict";

const cesker = {};

///////////////
// Producers //
///////////////

cesker.primitive = (advice) => (value, serial) => {
  // step({ value, serial });
  input("primitive", value, serial);
  return value;
};

cesker.builtin = (advice) => (value, name, serial) => {
  // step({ value, name, serial });
  input("builtin-(" + name + ")", value, serial);
  return value;
};

cesker.closure = (advice) => (value, serial) => {
  // step({ type: "closure", value, serial });
  scopeof.set(value, scope);
  input("closure", value, serial);
  return value;
};

cesker.read = (advice) => (value, identifier, serial) => {
  // step({ type: "read", value, identifier, serial });
  stack.push(scope[identifier]);
  return value;
};

cesker.error = (advice) => (value, serial) => {
  // step({ type: "error", value, serial });
  return value;
};

cesker.argument = (advice) =>
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

cesker.drop = (advice) => (value, serial) => {
  // step({ type: "drop", value, serial });
  stack.pop();
  return value;
};

cesker.write = (advice) => (value, identifier, serial) => {
  // step({ type: "write", value, identifier, serial });
  let frame = scope;
  while (!Reflect.getOwnPropertyDescriptor(frame, identifier))
    frame = Reflect.getPrototypeOf(frame);
  frame[identifier] = stack.pop();
  return value;
};

cesker.test = (advice) => (value, serial) => {
  // step({ type: "test", value, serial });
  output("test", value, serial);
  return value;
};

cesker.throw = (advice) => (value, serial) => {
  // step({ type: "throw", value, serial });
  return value;
};

cesker.eval = (advice) => (value, serial) => {
  // step({ type: "eval", value, serial });
  output("eval", value, serial);
  return aran.weave(Acorn.parse(value), pointcut, serial);
};

cesker.return = (advice) => (value, serial) => {
  // step({ type: "return", value, serial });
  scope = callstack.pop();
  if (scope === undefined) output("return", value, null);
  return value;
};

cesker.abrupt = (advice) => (value, serial) => {
  // step({ type: "abrupt", value, serial });
  const shadow = stack.pop();
  while (scope[SymbolTag] !== "closure") scope = Reflect.getPrototypeOf(scope);
  while (stack.length > scope[SymbolStackLength]) stack.pop();
  scope = callstack.pop();
  if (scope !== undefined) stack.push(shadow);
  return value;
};

cesker.success = (advice) => (value, serial) => {
  // step({ type: "success", value, serial });
  scope = callstack.pop();
  return value;
};

cesker.failure = (advice) => (value, serial) => {
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

cesker.debugger = (advice) => (serial) => {
  // step({ type: "debugger", serial });
};

cesker.program = (advice) => (value, serial) => {
  // step({ type: "program", value, serial });
  callstack.push(scope);
  scope = null;
};

cesker.arrival = (advice) => (callee, newtarget, self, arguments, serial) => {
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

cesker.enter = (advice) => (tag, labels, identifiers, serial) => {
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

cesker.leave = (advice) => (serial) => {
  scope = Reflect.getPrototypeOf(scope);
};

cesker.continue = (advice) => (label, serial) => {
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

cesker.break = (advice) => (label, serial) => {
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

cesker.unary = (advice) =>
  function (operator, value, serial) {
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

cesker.binary = (advice) =>
  function (operator, value1, value2, serial) {
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

cesker.apply = (advice) => (value1, value2, values, serial) => {
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
  // let tempApplyAdvice = cesker.apply;
  // const isConsoleCall = Object.values(nativeConsole).includes(value1);
  try {
    for (let index = values.length - 1; index >= 0; index--) {
      output("apply-argument-" + index, values[index], serial);
    }
    output("apply-this", value2, serial);
    output("apply-callee", value1, serial);
    // if (isConsoleCall) {
    //   cesker.apply = () => {};
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

cesker.construct = (advice) => (value, values, serial) => {
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

export { cesker };
