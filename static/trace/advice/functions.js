import { config } from '../data/config.js';
import { state } from '../data/state.js';
import { print } from '../lib/trace-log.js';

import { isBuiltIn } from '../lib/is-built-in.js';
import { isInRange } from '../lib/is-in-range.js';

const nativeConsole = console;
let callSymbol = null;

export default {
  apply(f, t, xs, serial) {
    if (typeof f !== 'function') {
      // throw the error right away for failure advice to catch
      //  without doing any apply logging
      f();
    }

    // console.log(0);

    // hack, because of instrumentation
    if (
      f.name === 'Object' &&
      f !== Object &&
      xs.length === 1 &&
      xs[0] &&
      xs[0].name === 'Object'
    ) {
      const result = Reflect.apply(f, t, xs);
      return result;
    }
    // console.log(1);

    const functionName = f.name || 'anonymous';

    state.node = state.aran.nodes[serial];
    const line = state.node.loc.start.line;
    const col = state.node.loc.start.column;

    // console.log(f, t, xs, serial, state.aran.nodes[serial]);
    // don't trace implicit object coercion of primitives
    if (
      state.node.callee &&
      state.node.callee.object &&
      (state.node.callee.object.type === 'Literal' || t === undefined) &&
      f.name === 'Object'
    ) {
      const result = Reflect.apply(f, t, xs);
      return result;
    }

    const commaSeparatedArgs = [];
    for (const arg of xs) {
      commaSeparatedArgs.push(arg);
      commaSeparatedArgs.push(',');
    }
    commaSeparatedArgs.pop();

    const nodeIsInRange = isInRange(state.node);

    // priority to console trace configuration
    const isConsoleCall =
      Object.values(console).includes(f) || t === nativeConsole;

    // because of instrumentation
    // if (f.name === "get" && xs[0] === console && xs[2] === console) {
    const firstAndThirdAreSame =
      (xs[0] ? xs[0].toString() : xs[0]) === (xs[2] ? xs[2].toString() : xs[2]);
    if (f.name === 'get' && xs.length === 3 && firstAndThirdAreSame) {
      const result = Reflect.apply(f, t, xs);
      // if (state.builtInEntryPoint === callSymbol) {
      //   state.builtInEntryPoint = null;
      // }
      return result;
    }

    // console.log(3);

    if (isConsoleCall && !config.console) {
      return undefined;
    }
    // console.log(4);

    // in case only console & not functions
    if (!nodeIsInRange || (!config.functions && !isConsoleCall)) {
      const result = Reflect.apply(f, t, xs);
      if (state.builtInEntryPoint === callSymbol) {
        state.builtInEntryPoint = null;
      }
      // console.log('a');
      return result;
    }

    // account for Aran implementation
    //  remove when upgrading to new Aran
    else if (f === Reflect.get || f === Object) {
      if (state.node.callee.type === 'MemberExpression') {
        // let errors be handled by failure
        // console.log('b');
        return Reflect.apply(f, t, xs);
      }
    }

    // console.log(4);

    // tracing selected functions
    if (
      config.functionsList.length !== 0 &&
      // !config.functionsList.find((query) => new RegExp(query).test(functionName))
      !config.functionsList.includes(functionName)
    ) {
      const result = Reflect.apply(f, t, xs);
      if (state.builtInEntryPoint === callSymbol) {
        state.builtInEntryPoint = null;
      }
      return result;
      // state.scopes.push(null);
      // const result = Reflect.apply(f, t, xs);
      // state.scopes.pop();
      // return result;
    }
    // console.log(5);

    // if (isConsoleCall && config.console) {
    //   print({
    //     prefix: [line, col],
    //     logs: [` console.${f ? functionName : f}(`, ...commaSeparatedArgs, ')'],
    //     overrideBuiltIn: true,
    //   });
    // }

    print({
      prefix: [line, col],
      logs: [
        functionName + ` (call${isBuiltIn(f) ? ', built-in' : ''}):`,
        ...commaSeparatedArgs,
      ],
      out: nativeConsole.groupCollapsed,
    });
    if (config.this) {
      print({
        logs: ['%cthis:', 'font-weight: bold;', t],
      });
    }

    // console.log(7);
    callSymbol = Symbol(f.name);
    // if (!state.builtInEntryPoint && isBuiltIn(f)) {
    //   // console.log(f.name);
    //   state.builtInEntryPoint = callSymbol;
    // }

    let returnValue = undefined;
    try {
      console = Object.keys(nativeConsole).reduce(
        (all, next) => ({ ...all, [next]: () => {} }),
        {},
      );
      returnValue = isConsoleCall ? undefined : Reflect.apply(f, t, xs);
    } catch (err) {
      throw err;
    } finally {
      console = nativeConsole;
    }

    // if (state.builtInEntryPoint === callSymbol) {
    //   state.builtInEntryPoint = null;
    // }

    print({
      prefix: '(returns):',
      logs: [returnValue],
      style: 'font-weight: bold;',
      end: true,
    });
    if (!state.builtInEntryPoint) {
      nativeConsole.groupEnd();
    }

    // console.log(6);

    return returnValue;
  },

  // closure: (f, serial) => {
  //   const g = function (...xs) {
  //     return Reflect.apply(f, this, Array.from(arguments));
  //   };
  //   Reflect.defineProperty(g, "name", {
  //     __proto__: null,
  //     value: functionName,
  //   });
  //   Reflect.defineProperty(g, "length", {
  //     __proto__: null,
  //     value: f.length,
  //   });
  //   return g;
  // },

  // // no good for this, will miss implicit returns. and can't tell if there was an explicti or no
  // return: (value, serial) => {
  //   // return META.return($x, @serial);
  //   // debugger;
  //   // account for native methods
  //   state.node = state.aran.nodes[serial];
  //   // console.log(state.node);
  //   const line = state.node.loc.start.line;
  //   if (!state.inNativeCallstack) {
  //     print({
  //       prefix: (prefixify) => prefixify(line) + " (return value):",
  //       logs: [value],
  //       style: "font-weight: bold;",
  //     });
  //   }

  //   return value;
  // },
};
