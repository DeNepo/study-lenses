var preAdvice = {
  a: (x) => {
    console.log("a", x);
  },
  b: (x) => {
    console.log("b", x);
  },
  c: (x) => {
    console.log("c", x);
  },
};

var adviceHistory = [];
var log = (argsObj) => {
  adviceHistory.push({ ...argsObj });
};

var advice = new Proxy(preAdvice, {
  get(target, prop) {
    if (typeof preAdvice[prop] === "function") {
      return new Proxy(target[prop], {
        apply(target, thisValue, args) {
          log({
            name: target.name,
            target,
            thisValue,
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
