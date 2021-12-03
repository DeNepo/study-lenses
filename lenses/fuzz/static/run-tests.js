import { rfdc } from "./rfdc.js";

const clone = rfdc();

const runItButton = document.getElementById("run-it-button");

const nativeConsole = console;

const testIt = (func, test, message) =>
  it(message, () => {
    if (test.throws) {
      console.log("%cthrows:", "font-weight: bold;", test.throws);
    }

    const argsToLog = test.argsClone ? test.argsClone : test.args;
    argsToLog.forEach((arg, index) =>
      console.log(`%carg ${index + 1}:`, "font-weight: bold;", arg)
    );

    if (test.throws) {
      console.log(
        "%cexpected:",
        "font-weight: bold;",
        `${test.expect.name}: ${test.expect.message}`
      );
    } else {
      console.log("%cexpected:", "font-weight: bold;", test.expect);
    }

    // -- --- -- -- - -- -- --- run it and get the results

    let actual;
    let didThrow = false;
    try {
      if (runItButton.config.debug) {
        // so it's easier to find the function source
        debugger;
      }
      // call the function with random arguments
      actual = func(...test.args);
    } catch (thrown) {
      if (!test.throws) {
        throw thrown;
      }
      didThrow = true;
      actual = thrown;
    }

    // test for side-effects if any args were reference-types
    console.log("-- -- -- -- -- -- -- -- --");

    if (test.argsClone) {
      const lengthToCheck =
        test.argsClone.length > test.args.length
          ? test.argsClone.length
          : test.args.length;
      for (let i = 0; i < lengthToCheck; i++) {
        if (
          typeof test.argsClone[i] !== "object" ||
          test.argsClone[i] === null
        ) {
          continue;
        }
        try {
          expect(test.args[i]).toEqual(test.argsClone[i]);
        } catch (err) {
          nativeConsole.log(
            `%cside-effect in arg ${i + 1}:\n`,
            "font-weight: bold;",
            test.args[i]
          );
          throw err;
        }
      }
    }

    console.log(`%cno side-effects`, "font-weight: bold;");

    // test the actual result against the expected
    console.log("-- -- -- -- -- -- -- -- --");

    try {
      if (test.throws) {
        if (didThrow) {
          console.log(
            `%cthrew:`,
            "font-weight: bold;",
            `${actual.name}: ${actual.message}`
          );
        } else {
          console.log(`%creturned:`, "font-weight: bold;", actual);
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
        console.log(`%creturned:`, "font-weight: bold;", actual);

        expect(actual).toEqual(test.expect);
      }
    } catch (err) {
      throw err;
    }
  });

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
