'use strict';

let log = console.log;
try {
  log = labeledLogger('.catch Consumer');
} catch (o_0) { };


/* .catch Consumer

  promises rejections are treated as errors
  you may have noticed this from the logs in the previous example

  you can handle rejections in promises using the .catch consumer
  You do this by calling a method on your promise and passing a callback
    const yourPromise = new Promise(()=>{}, ()=>{});
    yourPromise.catch(someCallback);

  Super important!
    The callback won't be used until AFTER the callstack has cleared
  what?
    whether your promise is rejected or resolved
    whether your executor is synchronous or asynchronous
    your .catch callback will always be executed asynchronously

*/


const handleRejection = (err) => {
  log('promise was rejected: ', err);
};


// always pending
const pendingExecutor = (resolve, reject) => {
  log('in pendingExecutor')
};
const pendingPromise = new Promise(pendingExecutor)
  .catch(err => handleRejection(err));
log('always pending, never settled:', pendingPromise);


// settled: resolved
const resolveExecutor = (resolve, reject) => {
  log('in resolveExecutor');
  resolve('settled: resolved');
};
const resolvedPromise = new Promise(resolveExecutor)
  .catch(err => handleRejection(err));
log('settled: resolved:', resolvedPromise);


// settled: rejected (intentional)
const rejectExecutor = (resolve, reject) => {
  log('in rejectExecutor');
  reject('settled: rejected');
};
// this rejection won't be handled until AFTER the callstack is clear
const rejectedPromise = new Promise(rejectExecutor)
  .catch(err => handleRejection(err));
log('settled: rejected (intentional):', rejectedPromise);


// settled: rejected (by error)
const errorExecutor = (resolve, reject) => {
  log('in errorExecutor');
  throw new Error('rejected by default, there was an error');
};
// this rejection won't be handled until AFTER the callstack is clear
const errorPromise = new Promise(errorExecutor)
  .catch(err => handleRejection(err));
log('settled: rejected (by error):', errorPromise);




log('synchronous tasks on the callstack have completed');
