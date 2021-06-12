import { rfdc } from "./rfdc.js";

const clone = rfdc();

const testIt = (func, test, message) =>
  it(message, () => {
    const currentTest = test;
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
      if (test.expect instanceof Error) {
        expect(() => func(...currentTest.args)).toThrow(
          currentTest.expect.constructor,
          currentTest.expect.message
        );
      } else {
        let actual;
        let didThrow = false;
        try {
          func(...currentTest.args);
        } catch (exception) {
          didThrow = true;
          actual = exception;
        }
        if (!didThrow) {
          expect.fail(`${func.name} did not throw`);
        } else {
          expect(actual).toEqual(currentTest.expect);
        }
      }
    } else {
      const actual = func(...currentTest.args);
      expect(actual).toEqual(currentTest.expect);
    }
  });

export const testRunner = (func, tests) => {
  describe(`${func.name} should pass these ${tests.length} random tests`, () => {
    tests.forEach(function runTest(test, index) {
      const checkForSideEffects = !test.args.every(
        (entry) => entry === null || typeof entry !== "object"
      );
      const argsClone = checkForSideEffects ? clone(test.args) : null;
      testIt(func, test, `random test ${index}`);
      if (checkForSideEffects) {
        it("    check for side-effects", () => {
          expect(test.args).toEqual(argsClone);
        });
      }
    });
  });
};
