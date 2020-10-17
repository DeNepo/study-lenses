'use strict';

let log = console.log;
try {
  log = labeledLogger('Pending vs. Settled');
} catch (o_0) { };

/*
  promises can be in one of two states:
    pending: neither `resolve` nor `reject` have been called
    settled: either resolve or reject has been called
  a settled promise can have two states
    resolved: `resolve` was called
    rejected: `reject` was called

  if you inspect the promises in your console you will see two things:
    PromiseState: is the promise fulfilled, rejected or pending ?
    PromiseResult : the value passed into `resolve` or `reject`
*/


// always pending
const pendingExecutor = (resolve, reject) => {
  log('in pendingExecutor')
};
const pendingPromise = new Promise(pendingExecutor);
log('always pending, never settled:', pendingPromise);

// settled: resolved
const resolveExecutor = (resolve, reject) => {
  log('in resolveExecutor');
  resolve('settled: resolved');
};
const resolvedPromise = new Promise(resolveExecutor);
log('settled: resolved:', resolvedPromise);


// settled: rejected (intentional)
const rejectExecutor = (resolve, reject) => {
  log('in rejectExecutor');
  reject('settled: rejected');
};
const rejectedPromise = new Promise(rejectExecutor);
log('settled: rejected (intentional):', rejectedPromise);


// settled: rejected (by error)
const errorExecutor = (resolve, reject) => {
  log('in errorExecutor');
  throw new Error('rejected by default, there was an error');
};
const errorPromise = new Promise(errorExecutor);
log('settled: rejected (by error):', errorPromise);




log('synchronous tasks on the callstack have completed');
