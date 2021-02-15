"use strict";

import { state } from "../data/state.js";
import { config } from "../data/config.js";

const linePrefix = (line) => {
  state.loggedSteps += 1;

  let prefix = "";

  // const scopeDepth = Array(state.scopes.length + 1).join("  ");
  // prefix = scopeDepth + prefix;

  if (config.lines) {
    const lineNumberString = line < 10 ? " " + line : "" + line;
    prefix = `line ${lineNumberString}: ` + prefix;
  }

  if (config.steps) {
    const stepNumberString =
      state.loggedSteps < 10 ? " " + state.loggedSteps : "" + state.loggedSteps;
    prefix = `${stepNumberString}. ` + prefix;
  }

  return "%c" + prefix;
};

export const print = ({ logs = [], prefix, out = console.log, style = "" }) => {
  if (typeof prefix === "number") {
    out(linePrefix(prefix), style || "", ...logs);
  } else if (typeof prefix === "string") {
    out("%c" + prefix, style || "", ...logs);
  } else if (typeof prefix === "function") {
    const finalPrefix = prefix(linePrefix);
    out(finalPrefix, style || "", ...logs);
  } else {
    out(...logs);
  }
};
