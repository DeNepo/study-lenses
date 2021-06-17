"use strict";

const { describe, it, beforeEach, afterEach } = (() => {
  let beforeEachCallback = null;
  let afterEachCallback = null;

  let itIsCalled = false;

  return {
    beforeEach: (callBack) => {
      if (typeof callBack !== "function") {
        throw new TypeError("beforeEach argument is not a function");
      }

      beforeEachCallback = callBack;
    },

    afterEach: (callBack) => {
      if (typeof callBack !== "function") {
        throw new TypeError("afterEach argument is not a function");
      }

      afterEachCallback = callBack;
    },

    describe: (description, testFunction, collapsed = false) => {
      if (typeof description !== "string") {
        throw new TypeError("first argument must be a string");
      }
      if (typeof testFunction !== "function") {
        throw new TypeError("second argument must be a function");
      }

      if (collapsed) {
        console.groupCollapsed(`%c${description}`, "font-weight: bold;");
      } else {
        console.group(`%c${description}`, "font-weight: bold;");
      }

      try {
        testFunction();
      } catch (err) {
        console.error("%cSUITE ERROR:", "font-weight: bold;", err);
      }

      console.groupEnd();

      beforeEachCallback = null;
      afterEachCallback = null;
    },

    it: (description, testFunction) => {
      if (itIsCalled) {
        throw new Error("can not call it from inside of it");
      }
      if (typeof description !== "string") {
        throw new TypeError("first argument must be a string");
      }
      if (typeof testFunction !== "function") {
        throw new TypeError("second argument must be a function");
      }

      itIsCalled = true;

      if (beforeEachCallback) {
        try {
          beforeEachCallback();
        } catch (err) {
          console.error("%cbeforeEach Error:", "font-weight: bold;", err);
        }
      }

      const consoleBackup = Object.assign({}, console);
      const consoleCalls = [];
      for (let key in console) {
        if (typeof console[key] === "function") {
          console[key] = function () {
            consoleCalls.push({ method: key, args: Array.from(arguments) });
          };
        }
      }

      let thrown = null;
      let threw = false;
      try {
        testFunction();
      } catch (exception) {
        threw = true;
        thrown = exception;
      }

      Object.assign(console, consoleBackup);

      if (threw) {
        console.groupCollapsed(
          `%c✖ FAIL: ${description}`,
          "font-weight: bold; color: red;"
        );
        for (let call of consoleCalls) {
          console[call.method](...call.args);
        }
        if (thrown instanceof Error) {
          console.error(`${thrown.name}: ${thrown.message}`);
        } else {
          console.error(thrown);
        }
        console.groupEnd();
      } else {
        if (consoleCalls.length === 0) {
          console.log(
            `%c√ PASS: ${description}`,
            "font-weight: bold; color: green;"
          );
        } else {
          console.groupCollapsed(
            `%c√ PASS: ${description}`,
            "font-weight: bold; color: green;"
          );
          for (let call of consoleCalls) {
            console[call.method](...call.args);
          }
          console.groupEnd();
        }
      }

      if (afterEachCallback) {
        try {
          afterEachCallback();
        } catch (err) {
          console.error("%cafterEach Error:", "font-weight: bold;", err);
        }
      }

      itIsCalled = false;
    },
  };
})();
