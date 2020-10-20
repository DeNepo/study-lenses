'use strict';

/* Chai is an assertion library
  you can think of it like a super console.assert
  if the assertion passes, nothing happens
  if the assertion fails, an error is thrown
*/

// for now we only care about .assert, so let's assign it to a separate variable
// it's conventional to declare dependencies at the top of a file like this
const assert = chai.assert;



// if the assertion passes, no error is thrown
try {
  assert.strictEqual(4, 4); // the same as ===
  console.log('PASS!');
} catch (error) {
  console.log(`FAIL: ${error.name}: ${error.message}`);
}

// if the assertion fails, an error is thrown
try {
  assert.strictEqual('4', 4); // the same as ===
  console.log('PASS!');
} catch (error) {
  console.log(`FAIL: ${error.name}: ${error.message}`);
}


// PS. to learn more about chai: https://www.chaijs.com/
//     to learn all the things chai can check: https://www.chaijs.com/api/assert/










