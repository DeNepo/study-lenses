"use strict";

var editor = ace.edit(document.querySelector("#demo1 .editor"));
var session = editor.getSession();
editor.setBehavioursEnabled(false);
editor.setHighlightActiveLine(false);
editor.setOption("fontFamily", "Source Code Pro");
editor.setOption("fontSize", "10pt");
editor.setShowPrintMargin(false);
editor.setTheme("ace/theme/textmate");
editor.setWrapBehavioursEnabled(false);
editor.setReadOnly(true)
session.setMode("ace/mode/javascript");
session.setOption("useWorker", false);
session.setTabSize(2);
session.setUseSoftTabs(true);
session.setUseWrapMode(false);


var sendToParserButton = document.querySelector("#demo1 .actions .send-to-parser"),
  playButton = document.querySelector("#demo1 .actions .play-button"),
  pauseButton = document.querySelector("#demo1 .actions .pause-button"),
  reportButton = document.querySelector("#demo1 .actions .report-button");

var interval = null;

var parserLink = null;
sendToParserButton.addEventListener("click", function(){ location.href = parserLink; });

function success(tree, code) {
  parserLink = "parser.html?type=" + tree.type + "&code=" + encodeURIComponent(code);
}

function failure(tree, code, error) {
  session.setMode("ace/mode/text");
  sendToParserButton.style.display = "none";
  playButton.style.display = "none";
  pauseButton.style.display = "none";
  reportButton.style.display = "initial";
  if (interval != null) clearInterval(interval);
  reportButton.addEventListener("click", function(){
    location.href =
      "https://github.com/shapesecurity/shift-fuzzer-js/issues/new?title=" +
      encodeURIComponent("I found a bug using the demo!") +
      "&body=" +
      encodeURIComponent(
        "> " + error.message + "\n\n" +
        "Here's the " + tree.type.toLowerCase() + ":\n\n" +
        "```js\n" + code.trim() + "\n```"
      );
  });
  reportButton.focus();
}

function knownErrors(tree) {
  var errList = validator.Validator.validate(tree);
  return errList.length > 0 && errList.every(function (e) {
    return e.description && e.description.match("is not declared") || e.message && e.message.match(/Duplicate (binding|export)|is not declared/); // pending https://github.com/shapesecurity/shift-fuzzer-js/issues/2
  });
}

function generate() {
  var tree, code;
  do {
    tree = fuzzer.fuzzProgram();
    code = codegen.default(tree, new codegen.FormattedCodeGen);
  } while (knownErrors(tree) || code.trim().length < 150);
  session.setValue(codegen.default(tree, new codegen.FormattedCodeGen));
  try {
    parser[tree.type === "Script" ? "parseScript" : "parseModule"](code);
    success(tree, code);
  } catch(e) {
    failure(tree, code, e);
  }
}

playButton.addEventListener("click", function() {
  interval = setInterval(generate, 600);
  playButton.style.display = "none";
  sendToParserButton.style.display = "none";
  pauseButton.style.display = "initial";
  pauseButton.focus();
  generate();
});
pauseButton.addEventListener("click", function() {
  clearInterval(interval);
  pauseButton.style.display = "none";
  sendToParserButton.style.display = "initial";
  playButton.style.display = "initial";
  playButton.focus();
});

generate();
