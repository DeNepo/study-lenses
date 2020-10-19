'use strict';

const log = labeledLogger('6. passing arguments');

// you can pass arguments to your callback via setTimeout and setInterval

let timeoutFinished = false;


const passingArguments_cb_1 = (message) => {
  log(message);
  clearInterval(intervalId);
  timeoutFinished = true;
};
setTimeout(passingArguments_cb_1, 5001, 'good bye');


const passingArguments_cb_2 = (message) => {
  if (timeoutFinished) {
    log('this will never happen!');
  } else {
    log(message)
  }
};
const intervalId = setInterval(passingArguments_cb_2, 500, 'hi!');

