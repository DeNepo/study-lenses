'use strict';

const log = labeledLogger('4. clearInterval');

// you can also stop a setInterval using it's id
//  this happens by passing the id as an argument to clearTimeout

let timeoutFinished = false;


const clearTheInterval = () => {
  log('clearing the interval');

  clearInterval(intervalId);
  timeoutFinished = true;
};
setTimeout(clearTheInterval, 5001); // what happens if you change this to 5000?


const intervalCallBack = () => {
  if (timeoutFinished) {
    log(':( this should never happen');
  } else {
    log('hi from interval');
  }
};
const intervalId = setInterval(intervalCallBack, 500);

