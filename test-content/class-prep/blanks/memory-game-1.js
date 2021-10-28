"use strict";

let thingToRemember = prompt(
  "enter some text, then remember it.\n\n" +
    "if you remember it correctly you win"
);

if (thingToRemember !== null) {
  let guess = prompt("now try to remember what it was:");
  if (guess !== null) {
    if (guess === thingToRemember) {
      alert("you win!");
    } else {
      alert("try again.");
    }
  }
}

alert("good bye");
