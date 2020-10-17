'use strict';

/* labeledLogger

  this is a function to (hopefully) help you understand the callstack and the event loop

  it provides this extra information:
    - label so you can tell which logger was called
    - the time you created the labeled logger
    - the time delay since the logger was created for each log (in milliseconds)
    - how many times you've called the logger
    - the callstack when you called the logger (click the label to see the callstack)

*/

// create new loggers with different labels
const treeLabel = labeledLogger('tree');
const horseLabel = labeledLogger('horse');


// then use them just like console.log!
treeLabel('hello 1');
horseLabel('good bye 1');

treeLabel('hello 2');
horseLabel('good bye 2');
horseLabel('good bye 3');



// expand the label to see the callstack
const callLogger = (logFunction) => {
  logFunction('called from callLogger');
};
callLogger(treeLabel);
callLogger(horseLabel);



// longer time delays
//  (more on this in the coming exercises)
const useTree = () => {
  treeLabel('at least 500 ms later');
};
setTimeout(useTree, 500);

const useHorse = () => {
  horseLabel('at least 2000 ms later');
};
setTimeout(useHorse, 2000);
