"use strict";

export const isNative = (arg) => {
  // https://davidwalsh.name/detect-native-function

  const toString = Object.prototype.toString;
  const fnToString = Function.prototype.toString;
  const reHostCtor = /^\[object .+?Constructor\]$/;
  const reNative = RegExp(
    "^" +
      String(toString)
        .replace(/[.*+?^${}()|[\]\/\\]/g, "\\$&")
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
      "$"
  );

  const argType = typeof arg;
  return argType == "function"
    ? reNative.test(fnToString.call(arg))
    : (arg && argType == "object" && reHostCtor.test(toString.call(arg))) ||
        false;
};
