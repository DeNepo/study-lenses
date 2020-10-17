'use strict';

let log = console.log;
try {
  log = labeledLogger("Errors in .then's");
} catch (o_0) { };



/* Errors in .then's

  if an error occurs in a .then
    the rest of the .then's will be skipped
    .catch's callback will be executed

*/



const logResolvedValue = (resolvedValue) => {
  log('resolved value: ', resolvedValue);
  return resolvedValue;
};
const throwAnError = (resolvedValue) => {
  throw new Error('an error in .then: ' + resolvedValue);
  return resolvedValue;
};


const handleRejection = (err) => {
  log('promise was rejected: ', err);
};



const fiveExecutor = (resolve, reject) => {
  log('in fiveExecutor');
  resolve(5);
};
const neverLogsFivePromise = new Promise(fiveExecutor)
  .then(resolved => throwAnError(resolved))
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('error before logging 5:', neverLogsFivePromise);


const helloExecutor = (resolve, reject) => {
  log('in helloExecutor');
  resolve('hello');
};
const doesLogHelloPromise = new Promise(helloExecutor)
  .then(resolved => logResolvedValue(resolved))
  .then(resolved => throwAnError(resolved))
  .catch(err => handleRejection(err));
log('error after logging "hello":', doesLogHelloPromise);




log('synchronous tasks on the callstack have completed');
