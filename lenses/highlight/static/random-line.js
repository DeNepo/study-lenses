document.getElementById("random-line").addEventListener("click", () => {
  let line = "";
  let index = 0;

  const lines = code.split("\n");
  const nonEmptyRegex = /[^\s]/;
  const nonEmptyLines = lines.filter((line) => nonEmptyRegex.test(line));

  let message = "";
  if (nonEmptyLines.length > 0) {
    do {
      index = Math.floor(Math.random() * lines.length);
      line = lines[index];
    } while (!nonEmptyRegex.test(line));
    message = `say everything you know about line ${index + 1}:\n\n${
      index + 1
    }| ${line}`;
  } else {
    message = "there are no non-empty lines in your program";
  }

  console.log(message);
  alert(message);
});
