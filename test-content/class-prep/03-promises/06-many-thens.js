'use strict';

let log = console.log;
try {
  log = labeledLogger("Many .then's");
} catch (o_0) { };



/* Many .then's

  you can use as many .then's as you like!
    they will be used in the order you write them

  you can return a value from your .then callbacks
  this value is available as the resolvedValue in your next .then

  a promise's value is the return value from the last .then
    (unless there was an error)

  notice! the logs come in waves:
    all the first .then's
    all the second .then's
    ...
  this is because each .then is like a setTimeout
    they schedule tasks to execute when the callstack is clear


*/



const logResolvedValue = (resolvedValue) => {
  log('resolved value: ', resolvedValue);
  return resolvedValue;
};
const valueIsNumber = (resolvedValue) => {
  return typeof resolvedValue === 'number';
};

const handleRejection = (err) => {
  log('promise was rejected: ', err);
};



// resolved to value 5
const resolveFiveExecutor = (resolve, reject) => {
  log('in resolveFiveExecutor');
  resolve(5);
};
const resolvedFivePromise = new Promise(resolveFiveExecutor)
  .then(resolved => logResolvedValue(resolved))
  .then(value => valueIsNumber(value))
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('settled, resolved 5:', resolvedFivePromise);



// resolved to value "hello"
const resolveHelloExecutor = (resolve, reject) => {
  log('in resolveHelloExecutor');
  resolve("hello");
};
const resolvedHelloPromise = new Promise(resolveHelloExecutor)
  .then(resolved => logResolvedValue(resolved))
  .then(value => valueIsNumber(value))
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('settled, resolved "hello":', resolvedHelloPromise);


// rejected (will skip all .thens)
const rejectExecutor = (resolve, reject) => {
  log('in rejectExecutor');
  reject('settled: rejected');
};
const rejectedPromise = new Promise(rejectExecutor)
  .then(resolved => logResolvedValue(resolved))
  .then(value => valueIsNumber(value))
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('settled: rejected (intentional):', rejectedPromise);



log('synchronous tasks on the callstack have completed');
