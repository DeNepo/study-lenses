"use strict";

const logEachCharacter = (string = "", index = 0) =>
  index !== string.length &&
  (console.log(string[index]), logEachCharacter(string, index + 1));

const word = "hello";

console.log(word);

logEachCharacter(word);

console.log(word);
