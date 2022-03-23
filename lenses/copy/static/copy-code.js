const code = document.getElementById('code').innerText;

const success = 'your code is copied';
const failure = 'oops, unable to copy your code';

// -------------------------

if (!navigator.clipboard) {
  fallbackCopyTextToClipboard(code);
} else {
  navigator.clipboard.writeText(code).then(
    () => alert(success),
    () => fallbackCopyTextToClipboard(code),
  );
}

// =========================

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    if (successful) {
      alert(success);
    } else {
      alert(failure);
    }
  } catch (err) {
    alert(failure);
  }

  document.body.removeChild(textArea);
  window.scrollTo(0, 0);
}
