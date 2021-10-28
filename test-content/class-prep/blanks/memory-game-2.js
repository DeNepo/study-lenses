"use strict";

let thingToRemember = prompt(
  "enter some text, then remember it.\n\n" +
    "if you remember it correctly you win"
);

if (thingToRemember !== null) {
  let displayTheText = confirm(
    "would you like to see your text one more time?"
  );
  if (displayTheText) {
    alert(thingToRemember);
  }
  let guess = prompt("now try to remember what it was:");
  if (guess !== null && guess === thingToRemember) {
    alert("you win!");
  } else {
    alert("try again.");
  }
}

alert("good bye");
