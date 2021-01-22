"use strict";

import { state } from "../data/state.js";

const linePrefix = (line) => {
  state.loggedSteps += 1;

  const stepNumberString =
    state.loggedSteps < 10 ? " " + state.loggedSteps : "" + state.loggedSteps;

  const scopeDepth = Array(state.scopeDepth).join("  ");

  const lineNumberString = line < 10 ? " " + line : "" + line;

  return `step ${stepNumberString}, line ${lineNumberString}: ${scopeDepth}`;
};

export const print = ({ logs = [], prefix, out = console.log }) => {
  if (typeof prefix === "number") {
    out(linePrefix(prefix), ...logs);
  } else if (typeof prefix === "string") {
    out(prefix, ...logs);
  } else {
    out(...logs);
  }
};
