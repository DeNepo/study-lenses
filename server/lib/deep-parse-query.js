"use strict";

const deepDecodeURIComponent = (thing) => {
  if (Array.isArray(thing)) {
    return thing.map(deepDecodeURIComponent);
  }
  if (thing && typeof thing === "object") {
    const decoded = {};
    for (const key in thing) {
      decoded[key] = deepDecodeURIComponent(thing[key]);
    }
    return decoded;
  }

  // is it a stringified JSON object?
  if (typeof thing === "string") {
    try {
      thing = JSON.parse(thing);
      if (typeof thing === "object" && thing !== null) {
        return deepDecodeURIComponent(thing);
      }
    } catch (o_0) {}
  }

  return decodeURIComponent(thing);
};

const deepParseQuery = (query) => {
  const deepParsed = {};
  for (const key in query) {
    deepParsed[key] = deepDecodeURIComponent(query[key]);
  }
  return deepParsed;
};

module.exports = deepParseQuery;
