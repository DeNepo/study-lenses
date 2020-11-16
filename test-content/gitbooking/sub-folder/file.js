let indent = '';
for (const letter of window.location.href) {
  console.log(indent + letter);
  indent += ' ';
}
