'use strict';

let log = console.log;
try {
  log = labeledLogger('New Promise');
} catch (o_0) { };


// new Promise creates ... a new promise!
// the constructor takes one argument:
//  a function, called the executor
// the executor is called immediately (synchronously)


const executor1 = () => {
  log('in executor 1');

  return 'executor return values are ignored';
};
const promise1 = new Promise(executor1);


const executor2 = () => {
  log('in executor 2');

  return 'executor return values are ignored';
};
const promise2 = new Promise(executor2);


log('all synchronous tasks are complete');
