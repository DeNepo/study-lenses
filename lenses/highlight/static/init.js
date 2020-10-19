// https://stackoverflow.com/a/24631113
function escapeHTML(string) {
  var pre = document.createElement('pre');
  var text = document.createTextNode(string);
  pre.appendChild(text);
  return pre.innerHTML;
}


const codeGoesHere = document.getElementById('code-goes-here')
codeGoesHere.innerHTML = escapeHTML(decodeURIComponent(code))
Prism.highlightAllUnder(codeGoesHere.parentElement);
