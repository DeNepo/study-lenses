import { config } from "../data/config.js";

export const isInRange = (node) => {
  // debugger;
  const start = node.loc.start.line;
  const end = node.loc.end.line;
  const range = config.range.end - config.range.start;

  let itIs = false;
  if (range > 0) {
    itIs = start >= config.range.start && end <= config.range.end;
  } else if (range < 0) {
    itIs = start <= config.range.start && end >= config.range.end;
  } else {
    itIs = start === config.range.start;
  }
  return itIs;
};
