// --- initialize aran ---

const aran = Aran({ namespace: "something" });

const settedUp = aran.setup();
const generated = Astring.generate(settedUp);
window.eval(generated);

// --- declare your advice and pointcut as normal ---

// this can be called anything
//  it is not the object you will use to instrument your code
const preAdvice = {
  /* ... */
};
const prePointcut = (name, node) => {
  /* ... */
};

// --- pass them through the ceskifier---

import { ceskify } from "./cesk-advice";

/*
  history: full step-by-step history of the cesk machine and transitions:
  {
    transitions: [...],
    states: [...]
  }
  pointcut: a new pointcut written to work with the the cesk machine advice
  ADVICE: cesk machine advice wrapped around the user's advice
    the cesk machine advice constructs the history object by reference
    then calls the user's advice without modifying it's behavior
*/
const { history, pointcut, something = ADVICE } = ceskify(
  preAdvice,
  prePointcut,
  aran // passing a reference to your instance for the cesk machine
);

// --- use aran as you normally would, but with the wrapped advice and pointcut ---

const code = "";

const originalTree = Acorn.parse(code, { locations: true });
// extra processing I added in so students don't step through the instrumented code
const deDebuggered = walk(originalTree, {
  // from https://github.com/Rich-Harris/estree-walker
  enter(node, parent, prop, index) {
    if (node.type === "DebuggerStatement") {
      this.remove();
    }
  },
});
const instrumented = aran.weave(deDebuggered, pointcut, null);

eval(instrumented);

// --- log the complete cesk machine history, every state and every transition ---

/* full step-by-step history of the cesk machine and transitions:
  {
    transitions: [...],
    states: [...]
  }
*/
console.log(history);
