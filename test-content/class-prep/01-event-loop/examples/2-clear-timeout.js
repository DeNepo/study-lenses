'use strict';

const log = labeledLogger('2. clearTimeout');

// you can stop a setTimeout from happening using it's id
//  this happens by passing the id as an argument to clearTimeout
//  in the slides, there is also a button to clear all timeouts -->

const setTimeout_cb_1 = () => {
  // this one never happens!
  log('in callback 1');
  clearTimeout(timeout2);
};
const timeout1 = setTimeout(setTimeout_cb_1, 2000);

log('launched timeout 1');

const setTimeout_cb_2 = () => {
  log('in callback 2');
  clearTimeout(timeout1);
};
const timeout2 = setTimeout(setTimeout_cb_2, 1000);

log('launched timeout 2');
