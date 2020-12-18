"use strict";

const deepDecodeURIComponent = (thing) => {
  if (typeof thing === "string") {
    // is it encoded?
    try {
      thing = decodeURIComponent(thing);
    } catch (o_0) {}
    // is it a stringified JSON object?
    try {
      const jsonParsed = JSON.parse(thing);
      // if it is, deeply decode it
      thing = deepDecodeURIComponent(jsonParsed);
    } catch (o_0) {}
    // return the thing
    return thing;
  } else if (Array.isArray(thing)) {
    return thing.map(deepDecodeURIComponent);
  } else if (thing && typeof thing === "object") {
    const decoded = {};
    for (const key in thing) {
      decoded[key] = deepDecodeURIComponent(thing[key]);
    }
    return decoded;
  } else {
    return thing;
  }
};

const deepParseQuery = (query) => {
  const deepParsed = {};
  for (const key in query) {
    deepParsed[key] = deepDecodeURIComponent(query[key]);
  }
  return deepParsed;
};

module.exports = deepParseQuery;
