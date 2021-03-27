const randomLineEl = document.getElementById("random-line");
if (randomLineEl) {
  randomLineEl.addEventListener("click", () => {
    const lines = code.split("\n");
    const index = Math.floor(Math.random() * lines.length);
    const line = lines[index];
    alert(`line ${index + 1}:\n\n${line}`);
  });
}
