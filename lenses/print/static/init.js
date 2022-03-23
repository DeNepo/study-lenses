document.getElementById('print').addEventListener('click', () => {
  const controls = document.getElementById('controls');
  controls.style.display = 'none';
  window.print();
  controls.style.display = 'inline-block';
});

document.getElementById('font-size').addEventListener('change', (event) => {
  const fontSize = Number(event.target.value);

  const styles = document.styleSheets[0].cssRules[0].style;

  if (event.target.value === '-') {
    fontSize = (fontSize * 100 - 1) / 100;
  } else if (event.target.value === '+') {
    fontSize = (fontSize * 100 + 1) / 100;
  }

  styles.fontSize = `${fontSize}em`;
});
