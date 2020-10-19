'use strict';

const log = labeledLogger('5. zero delays');

// setting the delay to 0 ms does not make the code execute synchronously
//  it says to wait 0 ms before moving the task to the callback queue
//  the task will be executed after all synchronous tasks are complete


const zeroDelays_cb_1 = () => {
  log('executing callback 1');
};

log('launching timeout 1');
setTimeout(zeroDelays_cb_1, 0);



const zeroDelays_cb_2 = () => {
  log('executing callback 2');
};

log('launching timeout 2');
setTimeout(zeroDelays_cb_2, 0);



log('hello!');

