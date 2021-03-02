// https://stackoverflow.com/a/24631113
function escapeHTML(string) {
  var pre = document.createElement("pre");
  var text = document.createTextNode(string);
  pre.appendChild(text);
  return pre.innerHTML;
}

const codeGoesHere = document.getElementById("code-goes-here");
codeGoesHere.innerHTML = escapeHTML(decodeURIComponent(code));
Prism.highlightAllUnder(codeGoesHere.parentElement);

const openWith = (code, lens) => {
  const pseudoResource = {
    resource: {
      content: code,
      // hard-coding for now, assume this is only used with JS
      info: { ext: ".js" },
    },
  };

  const stringifiedResource = encodeURIComponent(
    JSON.stringify(pseudoResource)
  );

  const resourceQuery = `--resource=${stringifiedResource}`;

  const url = window.location.origin + `?${lens}&${resourceQuery}`;

  window.open(url, "_blank");
};
