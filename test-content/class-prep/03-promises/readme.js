'use strict';

/* Promises

  All of the files in this folder are example
  for best results, study them with Promisees

  Promisees is a website to help you visualize promise execution
    there's up button for it up there ^
  It's not perfect, occasionally it will not render your code correctly
  check your console for errors
    if you see from demo.min.js, skip Promisees for that example/exercise
  If you find that the visualization is not helpful, don't worry about it
    it's only there to help, if isn't helping then ignore it

  As in JS Tutor, you can step forwards and backwards through execution

  In order to work in your console and Promisees
  these examples and exercises will have a little awkward code at the top:

*/

// declare `log` as console.log, this way it will work in Promisees
let log = console.log;

// try to reassign `log` to a labeledLogger
//  if you are in promisees this will throw an error
//    `log` will remain console.log, and the visualization will continue
//  if you are studying these from localhost
//    labeledLogger will work and your console will display the time of each log
try {
  log = labeledLogger('Where are you?');
} catch (o_0) { };


const youAreIn = log === console.log
  ? 'Promisees'
  : 'localhost';


log(youAreIn);
