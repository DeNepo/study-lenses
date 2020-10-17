'use strict';

let log = console.log;
try {
  log = labeledLogger('.then Consumer');
} catch (o_0) { };


/* .then Consumer

  Promises are strange things:
    you can's use their values as with normal objects
    you can only use them inside of consumers

  In the last example you learned about the .catch consumer
    this consumer is how you handle errors inside of promises
  but how can you use resolved values?
    .then allows you to define what logic to use with the resolved value
    .then consumers are also executed after the callstack is clear


  careful!  the order in which you add consumers matters
  first added, first used. (more on this in a later example)

*/


const logResolvedValue = (resolvedValue) => {
  log('resolved value: ', resolvedValue);
};

const handleRejection = (err) => {
  log('promise was rejected: ', err);
};



// settled: resolved
const resolveExecutor = (resolve, reject) => {
  log('in resolveExecutor');
  resolve('settled: resolved');
};
const resolvedPromise = new Promise(resolveExecutor)
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('settled: resolved:', resolvedPromise);


// settled: rejected (intentional)
const rejectExecutor = (resolve, reject) => {
  log('in rejectExecutor');
  reject('settled: rejected');
};
const rejectedPromise = new Promise(rejectExecutor)
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('settled: rejected (intentional):', rejectedPromise);



log('synchronous tasks on the callstack have completed');
