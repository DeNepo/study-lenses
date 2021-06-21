import { ceskAdvice, ceskState } from "./cesk-advice.js";
import { stepFactory } from "./step.js";
import { deepClone } from "somewhere";

// aran instance is passed for
export const ceskify = (userAdvice, userPointcut, aran) => {
  const history = {
    // how to account for hoisting in here?
    //   is transition 0 used for declaring hoisted variables & functions?
    transitions: [
      deepClone({
        i: 0,
        label: "initial",
        before: initialState,
      }),
    ],
    states: [
      deepClone({
        i: 0,
        ceskState,
      }),
    ],
  };

  const step = stepFactory(history, ceskState, aran);

  const finalAdvice = {};
  for (const key in ceskAdvice) {
    finalAdvice[key] = function () {
      step({
        // updates history by side-effect
        advice: key,
        serial: arguments[arguments.length - 1],
        args: Array.from(arguments),
      });
      // waaay too long signature. needs work
      return ceskAdvice(
        key,
        userAdvice[key],
        userPointcut,
        history,
        ceskState,
        aran
      );
    };
  }

  return {
    pointcut: (adviceName, node) => true,
    history,
    ADVICE: finalAdvice,
  };
};
