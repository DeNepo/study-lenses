import { print } from "../lib/trace-log.js";
import { config } from "../data/config.js";

export const logHoisted = (hoisted) => {
  for (const node of hoisted) {
    if (node.type === "VariableDeclaration") {
      for (const declaration of node.declarations) {
        if (
          config.variablesList.length !== 0 &&
          !config.variablesList.includes(declaration.id.name)
        ) {
          continue;
        }
        const line = declaration.loc.start.line;
        const col = declaration.loc.start.column;
        print({
          prefix: "",
          // logs: [declaration.id.name + " (hoisted, var)"],
          logs: ["hoist: var " + declaration.id.name],
        });
      }
    } else if (node.type === "FunctionDeclaration") {
      if (!config.functionDeclarations) {
        continue;
      }
      if (
        config.functionsList.length !== 0 &&
        !config.functionsList.includes(node.id.name)
      ) {
        continue;
      }
      const line = node.loc.start.line;
      const col = node.loc.start.column;
      print({
        prefix: "",
        // logs: [node.id.name + " (hoisted, function)"],
        logs: ["hoist: function " + node.id.name],
      });
    }
  }
};
