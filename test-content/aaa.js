#! somewhere

"use strict";

/**
 *
 * @param {*} x
 * @returns
 */
const func = (x) => {
  "use asm";
  return x * 3;
};

// ...

let sum = 0;
for (let i = 0; i < 5; i++) {
  sum += func(i);
}

if (true) {
  console.log(3);
}

/*
  ...
*/
