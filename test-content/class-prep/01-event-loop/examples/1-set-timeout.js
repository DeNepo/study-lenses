'use strict';

const log = labeledLogger('1. setTimeout');

// setTimeout takes two arguments:
//  callback: the task to schedule (function)
//  delay: how long to wait before executing the callback (in milliseconds)

// in "callbacks.js"e, the callbacks were executed synchronously on the callstack
//  setTimeout sends your callback around the event loop
//  in other words, it executes your callback asynchronously

const setTimeout_cb_1 = () => {
  log('hello from timeout 1');
};
setTimeout(setTimeout_cb_1, 3000);

log('launched timeout 1');

const setTimeout_cb_2 = () => {
  log('bonjour from timeout 2');
};
setTimeout(setTimeout_cb_2, 2000);

log('launched timeout 2');

