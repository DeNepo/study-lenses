'use strict';

let log = console.log;
try {
  log = labeledLogger('Using Promises 2');
} catch (o_0) { };

/* Using Promises 2

  all together!

  Try with these input values:
    asdf
    -2
    -1
    0
    1
    2

*/

const inputANumberExecutor = (resolve, reject) => {
  const userInput = prompt('enter an even number greater than 0');
  const isANumber = !isNaN(userInput) && userInput !== '';
  if (isANumber) {
    const userNumber = Number(userInput);
    resolve(userNumber);
  } else {
    reject('input is not a number: ' + userInput);
  }
};


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
const isEvenNumber = (resolvedValue) => {
  log('checking if ' + resolvedValue + ' is even');
  return resolvedValue % 2 === 0;
};
const alertSuccessFailure = (resolvedValue) => {
  const finalMessage = resolvedValue
    ? 'number is even'
    : 'number is not even';
  alert(finalMessage);
};

const handleRejection = (err) => {
  log('promise was rejected: ', err);
};



const isValidNumberPromise = new Promise(inputANumberExecutor)
  .then(value => mustBeGreaterThanZero(value))
  .then(resolved => logResolvedValue(resolved))
  .then(number => isEvenNumber(number))
  .then(resolved => alertSuccessFailure(resolved))
  .catch(err => handleRejection(err));

console.log('isValidNumberPromise:', isValidNumberPromise);



log('synchronous tasks on the callstack have completed');

