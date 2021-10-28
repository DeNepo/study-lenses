"use strict";

let input = prompt("enter something");

let response;
if (input === null) {
  response = ":(";
} else {
  let didConfirm = confirm("is this what you meant to input?\n-> " + input);
  if (didConfirm === false) {
    response = "try again";
  } else {
    response = "great!";
  }
}

alert(response);
