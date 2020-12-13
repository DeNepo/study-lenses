'use strict';

/* Double Swap 2

  rearrange the lines of code to pass the assertions

  careful, there may be extra lines of code!

*/


let a = 'y';
let b = 'x';
let temp = null;

temp = a;
a = b;
b = temp;

console.assert(a === 'x', 'a should be x');
console.assert(b === 'y', 'b should be y');
console.assert(temp === 'y', 'temp should be y');



const a = 'y'; // distractor
const b = 'x'; // distractor

temp = b; // distractor
