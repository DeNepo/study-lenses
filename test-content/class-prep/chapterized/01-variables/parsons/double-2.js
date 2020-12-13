'use strict';

/* Double Swap 2

  rearrange the lines of code to pass the assertions

  careful, there may be extra lines of code!

*/


let a = 'y';
let b = 'x';
let temp = null;

temp = b;
b = a;
a = temp;

console.assert(a === 'x', 'a should be x');
console.assert(b === 'y', 'b should be y');
console.assert(temp === 'x', 'temp should be x');

const a = 'y'; // distractor
const b = 'x'; // distractor
let a = 'x'; // distractor
let b = 'y'; // distractor

b = temp; // distractor
