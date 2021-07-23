"use strict";

const describeItify = (aWindow = {}) => {
  let describeDepth = 0;
  let itDepth = 0;

  let currentReports = [];

  // console output is blocked in a testing window
  //  the render functions use consoleBackup
  const consoleBackup = Object.assign({}, aWindow.console);
  // for (let key in aWindow.console) {
  //   if (typeof aWindow.console[key] === "function") {
  //     aWindow.console[key] = function () {};
  //   }
  // }

  const renderIt = (report) => {
    const asyncReport = report.ms !== null;
    if (report.error) {
      consoleBackup.groupCollapsed(
        `%c✖ FAIL${asyncReport ? ` (${report.ms} ms)` : ""}: ${
          report.description
        }`,
        "font-weight: bold; color: red;"
      );
      for (let call of report.consoleCalls) {
        consoleBackup[call.method](...call.args);
      }
      if (report.error instanceof Error) {
        consoleBackup.error(`${report.error.name}: ${report.error.message}`);
      } else {
        consoleBackup.error(report.error);
      }
      consoleBackup.groupEnd();
    } else {
      if (report.consoleCalls.length === 0) {
        consoleBackup.log(
          `%c√ PASS${asyncReport ? ` (${report.ms} ms)` : ""}: ${
            report.description
          }`,
          "font-weight: bold; color: green;"
        );
      } else {
        consoleBackup.groupCollapsed(
          `%c√ PASS: ${report.description}`,
          "font-weight: bold; color: green;"
        );
        for (let call of report.consoleCalls) {
          consoleBackup[call.method](...call.args);
        }
        consoleBackup.groupEnd();
      }
    }
  };

  const renderDescribe = (report) => {
    consoleBackup.group(report.description);
    for (const child of report.children) {
      if (child.type === "it") {
        renderIt(child);
      } else {
        renderDescribe(child);
      }
    }
    if (report.error) {
      consoleBackup.error("%cSUITE ERROR:", "font-weight: bold;", report.error);
    }
    consoleBackup.groupEnd();
  };

  const resolveReport = async (report) => {
    const resolvedReport = await report;

    if (Array.isArray(resolvedReport.children)) {
      resolvedReport.children = await Promise.all(
        resolvedReport.children.map(resolveReport)
      );
    }

    return resolvedReport;
  };

  const describe = async (description, testFunction) => {
    if (typeof description !== "string") {
      throw new TypeError("first argument must be a string");
    }
    if (typeof testFunction !== "function") {
      throw new TypeError("second argument must be a function");
    }
    if (testFunction.constructor.name === "AsyncFunction") {
      throw new TypeError("second argument cannot be an async function");
    }

    describeDepth++;

    const parentReports = currentReports;

    const report = {
      type: "describe",
      description,
      testFunction,
      children: [],
      consoleCalls: [],
      error: null,
    };
    const reportPromise = new Promise((res) => res(report));
    parentReports.push(reportPromise);

    currentReports = report.children;

    try {
      testFunction();
    } catch (err) {
      report.error = err;
    }

    describeDepth--;

    if (describeDepth === 0) {
      resolveReport(report).then(renderDescribe);
    }

    currentReports = parentReports;
  };

  const it = (description, testFunction) => {
    // commented in favor of immediately logging free-floating `it`s
    // if (describeDepth < 1) {
    //   throw new Error("cannot call `it` outside of a `describe`");
    // }
    if (itDepth > 0) {
      throw new Error("cannot call `it` inside of an `it`");
    }
    if (typeof description !== "string") {
      throw new TypeError("first argument must be a string");
    }
    if (typeof testFunction !== "function") {
      throw new TypeError("second argument must be a function");
    }

    itDepth++;

    const report = {
      type: "it",
      description,
      testFunction,
      consoleCalls: [],
      error: null,
      ms: null,
    };

    if (testFunction.constructor.name === "AsyncFunction") {
      currentReports.push(
        new Promise((res) => {
          const now = Date.now();
          testFunction()
            .then(() => {
              report.ms = Date.now() - now;
              res(report);
            })
            .catch((err) => {
              report.ms = Date.now() - now;
              report.error = err;
              res(report);
            });
        })
      );
    } else {
      try {
        testFunction();
        currentReports.push(new Promise((res) => res(report)));
      } catch (err) {
        report.error = err;
        currentReports.push(new Promise((res) => res(report)));
      }
    }

    // immediately log free-floating `it`s
    if (describeDepth === 0) {
      renderIt(report);
    }

    itDepth--;
  };

  aWindow.describe = describe;
  aWindow.it = it;

  return {
    describe,
    it,
  };
};
