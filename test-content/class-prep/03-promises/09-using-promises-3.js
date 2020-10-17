'use strict';

let log = console.log;
try {
  log = labeledLogger('Using Promises 3');
} catch (o_0) { };

/* Using Promises 3

  launch two promises

  notice! the logs come in waves:
    all the first .then's
    all the second .then's
    ...
  this is because each .then is like a setTimeout
    they schedule tasks to execute when the callstack is clear

*/


const mustBeGreaterThanZero = (resolvedValue) => {
  log('checking if ' + resolvedValue + ' is greater than 0');
  if (resolvedValue <= 0) {
    throw new RangeError(resolvedValue + ' is not greater than 0');
  }
  return resolvedValue;
};
const logResolvedValue = (resolvedValue) => {
  log('resolved value:', resolvedValue);
  return resolvedValue;
};
const alertSuccessFailure = (resolvedValue) => {
  const finalMessage = resolvedValue
    ? 'correct!'
    : 'incorrect :(';
  alert(finalMessage);
};

const handleRejection = (err) => {
  log('promise was rejected: ', err);
};


// input an even number
const inputEvenNumberExecutor = (resolve, reject) => {
  const userNumber = Number(prompt('enter an even number greater than 0'));
  const isANumber = !Number.isNaN(userNumber);
  if (isANumber) {
    resolve(userNumber);
  } else {
    reject('input is not a number');
  }
};
const isEvenNumber = (resolvedValue) => {
  log('checking if ' + resolvedValue + ' is even');
  return resolvedValue % 2 === 0;
};
const isEvenNumberPromise = new Promise(inputEvenNumberExecutor)
  .then(value => mustBeGreaterThanZero(value))
  .then(resolved => logResolvedValue(resolved))
  .then(number => isEvenNumber(number))
  .then(resolved => alertSuccessFailure(resolved))
  .catch(err => handleRejection(err));
console.log('isEvenNumberPromise:', isEvenNumberPromise);



// input odd number
const inputOddNumberExecutor = (resolve, reject) => {
  const userNumber = Number(prompt('enter an odd number greater than 0'));
  const isANumber = !Number.isNaN(userNumber);
  if (isANumber) {
    resolve(userNumber);
  } else {
    reject('input is not a number');
  }
};
const isOddNumber = (resolvedValue) => {
  log('checking if ' + resolvedValue + ' is odd');
  return resolvedValue % 2 !== 0;
};
const isOddNumberPromise = new Promise(inputOddNumberExecutor)
  .then(value => mustBeGreaterThanZero(value))
  .then(resolved => logResolvedValue(resolved))
  .then(number => isOddNumber(number))
  .then(resolved => alertSuccessFailure(resolved))
  .catch(err => handleRejection(err));
console.log('isOddNumberPromise:', isOddNumberPromise);



log('synchronous tasks on the callstack have completed');

