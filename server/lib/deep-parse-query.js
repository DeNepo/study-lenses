"use strict";

const deepDecodeURI = (thing) => {
  if (Array.isArray(thing)) {
    return thing.map(deepDecodeURI);
  }

  if (thing && typeof thing === "object") {
    const decoded = {};
    for (const key in thing) {
      decoded[key] = deepDecodeURI(thing[key]);
    }
    return decoded;
  }

  // is it a stringified JSON object?
  if (typeof thing === "string") {
    const decoded = decodeURIComponent(encodedURI);
    try {
      thing = JSON.parse(decoded);
      if (typeof thing === "object" && thing !== null) {
        return deepDecodeURI(thing);
      }
    } catch (o_0) {
      // console.log("--=", thing);
      // console.log("=--", o_0);
    }
  }

  return decodeURIComponent(thing);
};

const deepParseQuery = (query) => {
  const deepParsed = {};
  for (const key in query) {
    // deepParsed[key] = deepDecodeURI(query[key]);
    let decoded = query[key];
    try {
      decoded = decodeURIComponent(query[key]);
    } catch (err) {}
    try {
      deepParsed[key] = JSON.parse(decoded);
    } catch (err) {
      deepParsed[key] = query[key];
    }
    // console.log(key, query[key], JSON.parse(deepParsed[key], null, "  "));
  }
  return deepParsed;
};

module.exports = deepParseQuery;
