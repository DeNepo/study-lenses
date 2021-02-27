"use strict";

var editor = ace.edit(document.querySelector("#demo1 .editor"));

var errorContainer = document.querySelector("#demo1");

var error = document.querySelector("#demo1 .error-message");

function displayError(exception) {
  hideError();
  error.textContent = exception.message;
  if (exception.line) {
    editor.getSession().setAnnotations([{
      row: exception.line - 1,
      column: exception.column,
      text: exception.message,
      type: "error" // also warning and information
    }]);
  }
  errorContainer.classList.add("error");
}

function hideError() {
  errorContainer.classList.remove("error");
  editor.getSession().clearAnnotations();
}

function render(program) {
  hideError();
  editor.setValue(program, -1);
  hljs.highlightBlock(output);
}

var session = editor.getSession();
editor.setBehavioursEnabled(false);
editor.setHighlightActiveLine(false);
editor.setOption("fontFamily", "Source Code Pro");
editor.setOption("fontSize", "10pt");
editor.setShowPrintMargin(false);
editor.setTheme("ace/theme/textmate");
editor.setWrapBehavioursEnabled(false);
session.setMode("ace/mode/javascript");
session.setOption("useWorker", false);
session.setTabSize(2);
session.setUseSoftTabs(true);
session.setUseWrapMode(false);

function onChange(codeGenerator) {
  var code = editor.getValue();
  try {
    var ast = parser.parseModule(code);
    var program = codegen.default(ast, codeGenerator);
  } catch (ex) {
    displayError(ex);
    return;
  }
  render(program);
}

function onLoad() {
  document.querySelector("#pretty-button").addEventListener('click', function() {
    onChange(new codegen.FormattedCodeGen);
  });
  document.querySelector("#minimal-button").addEventListener('click', function() {
    onChange(new codegen.MinimalCodeGen);
  });
}

window.addEventListener('DOMContentLoaded', onLoad);
