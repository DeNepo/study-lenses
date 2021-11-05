// --- disable copy-paste ---

// https://stackoverflow.com/questions/9958478/how-to-disable-copy-paste-browser

// https://stackoverflow.com/a/46738248
document.addEventListener("copy", (e) => {
  e.clipboardData.setData("text/plain", "'no copying in a quiz ;)'");
  e.clipboardData.setData("text/html", "<b>'no copying in a quiz ;)'</b>");
  e.preventDefault();
});

// https://stackoverflow.com/a/65429310
document.oncontextmenu = new Function("return false");
document.body.oncut = new Function("return false");
document.body.oncopy = new Function("return false");
document.body.onpaste = new Function("return false");

// https://stackoverflow.com/a/51541193
document.onkeydown = new Function(
  "if ((arguments[0] || window.event).ctrlKey) return false"
);

{
  // --- disable console output and interactions ---

  const nope = "nope! you're in a quiz ;)";

  const blockedGlobals = ["prompt", "alert", "confirm", "console"];

  for (const global of blockedGlobals) {
    Object.defineProperty(window, global, {
      get: () => {
        throw nope;
      },
    });
  }
}
