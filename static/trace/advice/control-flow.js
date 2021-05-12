import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { isInRange } from "../lib/is-in-range.js";
import { print } from "../lib/trace-log.js";

const breakOrContinue = (type) => (label, serial) => {
  state.node = state.aran.nodes[serial];
  if (!isInRange(state.node)) {
    return;
  }

  // console.log(state.node);
  const line = state.node.test
    ? state.node.test.loc.start.line
    : state.node.loc.start.line;
  const col = state.node.test
    ? state.node.test.loc.start.column
    : state.node.loc.start.column;

  print({
    prefix: (linePrefix) =>
      linePrefix(line, col) + " " + type + " " + (label || ""),
    style: "font-weight: bold;",
  });
};

let lastForInStep = 0;
let lastForIn = null;

export default {
  test: (consumed, serial) => {
    state.node = state.aran.nodes[serial];
    if (!isInRange(state.node)) {
      return consumed;
    }

    const line = state.node.test
      ? state.node.test.loc.start.line
      : state.node.loc.start.line;
    const col = state.node.test
      ? state.node.test.loc.start.column
      : state.node.loc.start.column;

    if (state.node.type === "LogicalExpression") {
      if (
        config.operatorsList.length !== 0 &&
        !config.operatorsList.includes(state.node.operator)
      ) {
        return consumed;
      }

      const lineOfCode = state.code.split("\n")[line - 1];

      const truthiness = consumed ? "truthy" : "falsy";
      print({
        prefix: [line, col],
        logs: [
          "operator (" + state.node.operator + ", " + truthiness + "):",
          consumed,
        ],
        out: console.groupCollapsed,
      });
      print({ logs: [lineOfCode] });
      console.groupEnd();
      return consumed;
    }

    if (state.node.type === "ConditionalExpression") {
      if (
        config.operatorsList.length !== 0 &&
        !config.operatorsList.includes("_?_:_")
      ) {
        return consumed;
      }

      const lineOfCode = state.code.split("\n")[line - 1];

      const truthiness = consumed ? "truthy" : "falsy";
      print({
        prefix: [line, col],
        logs: ["operator (_?_:_, " + truthiness + "):", consumed],
        out: console.groupCollapsed,
      });
      print({ logs: [lineOfCode] });
      console.groupEnd();
      return consumed;
    }

    let controlName = "";
    if (state.node.type === "IfStatement") {
      controlName = "if";
    } else if (state.node.type === "SwitchStatement") {
      controlName = "switch";
    } else if (state.node.type === "SwitchCase") {
      controlName = "case";
    } else if (state.node.type === "WhileStatement") {
      controlName = "while";
    } else if (state.node.type === "DoWhileStatement") {
      controlName = "do-while";
    } else if (state.node.type === "ForStatement") {
      controlName = "for";
    } else if (state.node.type === "ForOfStatement") {
      controlName = "for-of";
    } else if (state.node.type === "ForInStatement") {
      controlName = "for-in";
    }

    const isNotInList =
      config.controlFlowList.length !== 0 &&
      !config.controlFlowList.includes(controlName);
    if (isNotInList) {
      return consumed;
    }

    const lineOfCode = state.code.split("\n")[line - 1];

    const truthiness = consumed ? "truthy" : "falsy";

    if (
      state.node.type === "ForInStatement" ||
      state.node.type === "ForOfStatement"
    ) {
      if (state.node.type === "ForInStatement") {
        if (typeof consumed === "object") {
          return consumed;
        }

        if (
          consumed === true &&
          lastForInStep == state.loggedSteps - 1 &&
          lastForIn === state.node
        ) {
          return consumed;
        }

        lastForInStep = state.loggedSteps;
        lastForIn = state.node;
      }
      print({
        prefix: [line, col],
        logs: ["check (" + controlName + "):", consumed],
        out: console.groupCollapsed,
      });
      print({ prefix: "", logs: [lineOfCode] });
      console.groupEnd();
    } else {
      print({
        prefix: [line, col],
        logs: ["check (" + controlName + ", " + truthiness + "):", consumed],
        out: console.groupCollapsed,
      });
      print({ prefix: "", logs: [lineOfCode] });
      console.groupEnd();
    }

    // }
    // console.log(state.node);
    return consumed;
  },
  break: breakOrContinue("break"),
  continue: breakOrContinue("continue"),
};
