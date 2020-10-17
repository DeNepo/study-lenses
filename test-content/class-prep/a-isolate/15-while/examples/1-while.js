// 1: use strict
'use strict';

// 2: declare and assign a
let a = 0;
// 3: declare and assign b
const b = 8;

// 4, 6, 8, 10, 12: check the condition
while (a !== b) {
  // 5, 7, 9, 11: increment a
  a += b / 4;
}

// 13: assert a
console.assert(a === 8, 'Test 1');

/* anatomy of a while loop: https://javascript.info/while-for#the-while-loop
  while (condition) {
    // ... loop body ...
  }
*/

/* variables analysis:

  a: accumulator, number, strategy
    a also holds the final result
    it accumulates b/4
    declared in global scope
    reassigned in the while loop
    read in the assertion
  b: constant, number, strategy
    it's value is used to create the final result
    it's also read in the loop while condition
    declared in global scope
    read in while body

  this is a simple analysis, what would you want to add?
*/
