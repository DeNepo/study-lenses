// this example does not number the program steps
// because you never know what a user will input
// it can be very hard to predict the steps

/* use strict
  avoid avoidable mistakes
*/
'use strict'

/* declare userInput
  this variable will be used to store and validate user input
*/
let userInput = '';

/* while loop, check value of userInput
  this loop prevents the program from continuing
  until the user inputs the correct value
*/
while (userInput !== 'jAVAsCRIPT') {
  /* prompt the user for input
    tell the user exactly what to input
    and warn them of the consequences if they don't
  */
  userInput = prompt("enter exactly this, or you'll never leave: jAVAsCRIPT.");
}


/* alert to the user
  a friendly program is a good program :)
*/
alert(':)');
