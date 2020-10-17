'use strict';

const log = labeledLogger('3. setInterval');

// setInterval takes two arguments:
//  callback: the task to schedule (function)
//  delay: how long to wait before executing the callback (in milliseconds)

// setInterval goes on forever until it's stopped
//  there's a nice button up there called "clear scheduled"
//  it will clear all intervals and timeouts


const setInterval_cb_1 = () => {
  log('hello from interval 1');
};
setInterval(setInterval_cb_1, 500);

log('launched interval 1');


const setInterval_cb_2 = () => {
  log('bonjour from interval 2');
};
setInterval(setInterval_cb_2, 1000);

log('launched interval 2');
