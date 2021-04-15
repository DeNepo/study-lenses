import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/trace-log.js";

const getRandomColor = () => {
  // https://stackoverflow.com/questions/1484506/random-color-generator
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default {
  enter: (tag, labels, variables, serial) => {
    // debugger;
    if (config.blockScope) {
      state.blockScopeDepth += 1;
      console.log("enter ", state.blockScopeDepth);
    }
    return;

    // state.node = state.aran.nodes[serial];
    // // console.log(state.node);

    // const color = getRandomColor();

    // const line = state.node.loc.start.line;
    // print({
    //   prefix: line,
    //   logs: [
    //     "block scope (" +
    //       (labels.length > 0 ? `${labels.join(", ")}:` : "") +
    //       tag +
    //       ")",
    //   ],
    //   out: console.groupCollapsed,
    // });

    // if (labels[0]) {
    //   state.scopes.push({
    //     label: labels[0],
    //     type: "block",
    //     color,
    //   });
    // } else {
    //   state.scopes.push({ type: "block", color });
    // }

    // console.log(state.scopeDepth);
    // console.log(tag, labels, variables, serial);
  },
  leave: (serial) => {
    // leave trap is not triggered if returning from a block

    if (config.blockScope) {
      state.blockScopeDepth -= 1;
      console.log("leave ", state.blockScopeDepth);
    }
    return;

    // console.groupEnd();
    // state.node = state.aran.nodes[serial];
    // // console.log(state.node);
    // const line = state.node.loc.end.line;

    // const block = state.scopes.pop();
    // if (state.blockLabels.length !== 0) {
    //   print({ prefix: line, logs: ["END BLOCK: " + block] });
    // } else {
    //   print({ prefix: line, logs: ["END BLOCK"] });
    // }
  },
};
