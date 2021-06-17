import { rfdc } from "./rfdc.js";

const clone = rfdc();

const testIt = (func, test, message) => {
  it(message, () => {
    if (test.args.length === 1) {
      console.log(`%carg:`, "font-weight: bold;", test.args[0]);
    } else {
      test.args.forEach((arg, index) =>
        console.log(`%carg ${index + 1}:`, "font-weight: bold;", arg)
      );
    }
    if (test.throws) {
      console.log(
        "%cexpect:",
        "font-weight: bold;",
        `${test.expect.name}: ${test.expect.message}`
      );
      console.log("%cthrows:", "font-weight: bold;", test.throws);
    } else {
      console.log("%cexpect:", "font-weight: bold;", test.expect);
    }
    if (test.throws) {
      let actual;
      let didThrow = false;
      try {
        actual = func(...test.args);
      } catch (thrown) {
        didThrow = true;
        actual = thrown;
      }

      if (didThrow) {
        console.log(
          `%cthrew:`,
          "font-weight: bold;",
          `${actual.name}: ${actual.message}`
        );
      } else {
        console.log(`%creturned:`, "font-weight: bold;", actual);
      }

      if (!didThrow) {
        expect(() => {}).toThrow(test.expect);
      }

      if (test.expect instanceof Error) {
        expect(() => {
          throw actual;
        }).toThrow(test.expect.constructor);
        expect(() => {
          throw actual;
        }).toThrow(test.expect.message);
      } else {
        expect(() => {
          throw actual;
        }).toThrow(test.expect);
      }
    } else {
      const actual = func(...test.args);
      console.log(`%creturned:`, "font-weight: bold;", actual);
      expect(actual).toEqual(test.expect);
    }
  });
  if (checkForSideEffects) {
    try {
      expect(test.args).toEqual(argsClone);
      console.log(`%carg:`, "font-weight: bold;", false);
    } catch (err) {
      console.log(`%cside-effects:`, "font-weight: bold;", true);
      throw err;
    }
  }
};

export const runTests = (func, tests) => {
  describe(`${func.name} should pass these ${tests.length} random tests`, () => {
    for (let index = 0; index < tests.length; index++) {
      const test = tests[index];
      const checkForSideEffects = !test.args.every(
        (entry) => entry === null || typeof entry !== "object"
      );
      if (checkForSideEffects) {
        test.argsClone = clone(test.args);
      }
      testIt(func, test, `random test ${index}`);
    }
  });
};
