'use strict';

let log = console.log;
try {
  log = labeledLogger('Using Promises 3: timeouts');
} catch (o_0) { };

/* Using Promises 3: timeouts

  like before, but with a random timeout in each consumer
  you should notice:
    the consumers still happen in order, no matter what the timeout!

  this is the whole point of promises:
    make sure that the correct tasks happen in the correct order
    regardless of what is happening elsewhere in the event loop

*/

const inputANumberExecutor = (resolve) => {
  const randomNumber = Math.floor(Math.random() * 10) - 2;
  log('randomNumber:', randomNumber);
  setTimeout(() => {
    resolve(randomNumber);
  }, Math.floor(Math.random() * 2000)); // random delay between 0 and 2000 ms
};


const mustBeGreaterThanZero = (resolvedValue) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (resolvedValue <= 0) {
        reject(new RangeError(resolvedValue + ' is not greater than 0'));
      }
      resolve(resolvedValue);
    }, Math.floor(Math.random() * 2000));
  });
};
const logResolvedValue = (resolvedValue) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      log('resolved value:', resolvedValue);
      resolve(resolvedValue);
    }, Math.floor(Math.random() * 2000));
  });
};

const isEvenNumber = (resolvedValue) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      log('checking if ' + resolvedValue + ' is even');
      const isEven = resolvedValue % 2 === 0;
      resolve(isEven);
    }, Math.floor(Math.random() * 2000));
  });
};


const handleRejection = (err) => {
  log('promise was rejected: ', err);
};



const isValidNumberPromise = new Promise(inputANumberExecutor)
  .then(value => mustBeGreaterThanZero(value))
  .then(resolved => logResolvedValue(resolved))
  .then(number => isEvenNumber(number))
  .then(resolved => logResolvedValue(resolved))
  .catch(err => handleRejection(err));

console.log('isValidNumberPromise:', isValidNumberPromise);



log('synchronous tasks on the callstack have completed');

