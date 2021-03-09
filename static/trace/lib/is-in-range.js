import { config } from "../data/config.js";

export const isInRange = (node) => {
  const range = config.range.end - config.range.start;

  let itIs = false;
  if (range > 0) {
    itIs =
      node.loc.start.line >= config.range.start &&
      node.loc.start.line <= config.range.end;
  } else if (range < 0) {
    itIs =
      node.loc.start.line <= config.range.start &&
      node.loc.start.line >= config.range.end;
  } else {
    itIs = node.loc.start.line === config.range.start;
  }
  return itIs;
};
