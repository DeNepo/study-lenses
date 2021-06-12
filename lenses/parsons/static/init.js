// extract all block comments, including leading or trailing white space
//  so the lines of code maintain the correct indentation
//  and so the block comments maintain their indentation in the UI
const blockComments = raw.match(/[^\S\r\n]*\/\*([\S\s]*?)\*\/[^\S\r\n]*/gm);

let preCode = raw;
// remove the captured block comments from the code
if (blockComments) {
  for (const blockComment of blockComments) {
    preCode = preCode.replace(blockComment, "");
  }
}

//  - register all distractor lines
const distractorReplacer = "$_$_$_$_$_$_$_$_$_$_$_$";
const distractorReplaced = preCode
  .replace(/\/\/[^\S\r\n]+distractor\s*$/gm, distractorReplacer)
  .replace(/\/\/distractor\s*$/gm, distractorReplacer);

const strippedCode = strip(distractorReplaced)
  .split(distractorReplacer)
  .join("// distractor");

const code = strippedCode.replace("\\", "\\ ");

// render the highlighted code

// https://stackoverflow.com/a/24631113
function escapeHTML(string) {
  var pre = document.createElement("pre");
  var text = document.createTextNode(string);
  pre.appendChild(text);
  return pre.innerHTML;
}

const traceSteps = blockComments[0].replace("/*", "").replace("*/", "");

const codeGoesHere = document.getElementById("code-goes-here");
codeGoesHere.innerHTML = escapeHTML(decodeURIComponent(code));
Prism.highlightAllUnder(codeGoesHere.parentElement);

const parsonsComponent = new JSParsons(traceSteps, ".txt");
document.getElementById("parsons-container").appendChild(parsonsComponent);
// const code = just the code, not the comment
//  put it in prism
