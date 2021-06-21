// recursively check the iframe's window object for all functions
//  compare each called function to see if it's there
/*
  Reflect.ownKeys - capture non-enumerable
  Reflect.getOwnPropertyDescription
*/

export const isBuiltIn = (arg) => {
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
