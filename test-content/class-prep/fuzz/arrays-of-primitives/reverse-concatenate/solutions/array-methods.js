export const arrayMethods = (arr) =>
  [...arr] // .reverse has a side effect, so copy the argument
    .reverse() // reverse the copied array
    .reduce(_);
