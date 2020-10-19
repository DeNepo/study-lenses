'use strict';

let log = console.log;
try {
  log = labeledLogger('Using Promises 1');
} catch (o_0) { };

/* Using Promises 1

  you can think of consumers as control flow for promises
    if `resolve` is called, .then's callback is executed
    if `reject` is called or an error is thrown, .catch's callback is executed

*/


const logResolvedValue = (resolvedValue) => {
  log('resolved value: ', resolvedValue);
};

const handleRejection = (err) => {
  log('promise was rejected: ', err);
};


// resolve/reject based on user input with if/else
const userInputExecutor = (resolve, reject) => {
  const userInput = prompt('enter a number');
  const isANumber = !isNaN(userInput) && userInput !== '';
  if (isANumber) {
    resolve('you entered the number: ' + userInput);
  } else {
    reject('is not a number: ' + userInput)
  }
};
const userInputPromise = new Promise(userInputExecutor)
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('userInputPromise:', userInputPromise);


// resolve/reject based on a random number with if/else
const randomNumberExecutor = (resolve, reject) => {
  const randomNumber = Math.random()
  if (randomNumber > 0.5) {
    resolve('random number is greater than 0.5: ' + randomNumber);
  } else {
    reject('random number is less than 0.5: ' + randomNumber);
  }
};
const randomNumberPromise = new Promise(randomNumberExecutor)
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('randomNumberPromise:', randomNumberPromise);



// resolve/reject based on an error with try/catch
const inputLengthExecutor = (resolve, reject) => {
  const userInput = prompt('enter some text or hit escape');
  try {
    const inputLength = userInput.length;
    resolve('your input is ' + inputLength + ' characters long');
  } catch (err) {
    reject(err);
  }
};
const inputLengthPromise = new Promise(inputLengthExecutor)
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));
log('inputLengthPromise:', inputLengthPromise);



log('synchronous tasks on the callstack have completed');
