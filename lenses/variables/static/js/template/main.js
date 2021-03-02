"use strict";

// fn from http://underscorejs.org/docs/underscore.html
// https://github.com/jashkenas/underscore/blob/master/LICENSE
function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = Date.now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

var templateEditor = ace.edit(document.querySelector("#template"));
var modifierEditor = ace.edit(document.querySelector("#modifier"));

var templateContainer = document.querySelector("#template-container");
var modifierContainer = document.querySelector("#modifier-container");

var templateError = document.querySelector("#template-container .error-message");
var modifierError = document.querySelector("#modifier-container .error-message");

var output = ace.edit(document.querySelector("#output"));
var outputContainer = document.querySelector("#demo1 .output-container");

var scriptRadio = document.querySelector("#script-radio");
var moduleRadio = document.querySelector("#module-radio");

function displayError(exception, container, editor, error) {
  hideError(container, editor);
  error.textContent = exception.description || exception.message;
  console.dir(exception);
  if (exception.line) {
    editor.getSession().setAnnotations([{
      // check for both properties since Error object line/column cannot be redefined in Safari
      row: (exception.parseErrorLine || exception.line) - 1,
      column: exception.parseErrorColumn || exception.column,
      text: exception.description,
      type: "error" // also warning and information
    }]);
  }
  container.classList.add("error");
}

function hideError(container, editor) {
  container.classList.remove("error");
  editor.getSession().clearAnnotations();
}

function render(ast) {
  output.setValue(ast, -1);
}

templateEditor.$blockScrolling = Infinity;
var templateSession = templateEditor.getSession();
templateEditor.setBehavioursEnabled(false);
templateEditor.setHighlightActiveLine(false);
templateEditor.setOption("fontFamily", "Source Code Pro");
templateEditor.setOption("fontSize", "10pt");
templateEditor.setShowPrintMargin(false);
templateEditor.setTheme("ace/theme/textmate");
templateEditor.setWrapBehavioursEnabled(false);
templateSession.setMode("ace/mode/javascript");
templateSession.setOption("useWorker", false);
templateSession.setTabSize(2);
templateSession.setUseSoftTabs(true);
templateSession.setUseWrapMode(false);

modifierEditor.$blockScrolling = Infinity;
var modifierSession = modifierEditor.getSession();
modifierEditor.setBehavioursEnabled(false);
modifierEditor.setHighlightActiveLine(false);
modifierEditor.setOption("fontFamily", "Source Code Pro");
modifierEditor.setOption("fontSize", "10pt");
modifierEditor.setShowPrintMargin(false);
modifierEditor.setTheme("ace/theme/textmate");
modifierEditor.setWrapBehavioursEnabled(false);
modifierSession.setMode("ace/mode/javascript");
modifierSession.setOption("useWorker", false);
modifierSession.setTabSize(2);
modifierSession.setUseSoftTabs(true);
modifierSession.setUseWrapMode(false);

output.$blockScrolling = Infinity;
var outputSession = output.getSession();
output.setBehavioursEnabled(false);
output.setHighlightActiveLine(false);
output.setOption("fontFamily", "Source Code Pro");
output.setOption("fontSize", "10pt");
output.setShowPrintMargin(false);
output.setTheme("ace/theme/textmate");
output.setWrapBehavioursEnabled(false);
output.setReadOnly(true);
outputSession.setMode("ace/mode/javascript");
outputSession.setOption("useWorker", false);
outputSession.setTabSize(2);
outputSession.setUseSoftTabs(true);
outputSession.setUseWrapMode(false);

var params = {};
location.search.replace(/[?&](\w+)=([^&]*)/g, function(match, param, value){
  params[param] = decodeURIComponent(value);
});
if ('template_type' in params) {
  (params.template_type === 'script' ? scriptRadio : moduleRadio).checked = true;
}
if ('template' in params) {
  templateEditor.setValue(params.template, -1);
}
if ('modifier' in params) {
  modifierEditor.setValue(params.modifier, -1);
}

var isLoaded = false;

function onChange() {
  hideError(templateContainer, templateEditor);
  hideError(modifierContainer, modifierEditor);
  var code = templateEditor.getValue();
  var modifier = modifierEditor.getValue();
  if (modifier.match(/^[\w\n]*{/) !== null) { // allow direct object expressions
    modifier = `(${modifier})`;
  }
  var evaluatedModifier = {};
  try {
    parser.parseScript(modifier); // check parse errors, otherwise we don't get reliable location information
    evaluatedModifier = (function() {
      var Shift = ast;
      return eval(modifier);
    })() || {}
  } catch (ex) {
    displayError(ex, modifierContainer, modifierEditor, modifierError);
    try { // recheck the template for errors
      (moduleRadio.checked ? parser.parseModule : parser.parseScript)(code);
    } catch (ex) {
      displayError(ex, templateContainer, templateEditor, templateError);
    }
    return;
  }
  if (isLoaded) {
    var args = {
      template_type: scriptRadio.checked ? 'script' : 'module',
      template: encodeURIComponent(templateEditor.getValue()),
      modifier: encodeURIComponent(modifierEditor.getValue()),
    };
    history.pushState({}, '', `?${Object.keys(args).map(name => `${name}=${args[name]}`).join('&')}`);
  }
  isLoaded = true;
  try {
    var templatedSource = template.applyStructuredTemplate(code, evaluatedModifier, {isModule: moduleRadio.checked});
  } catch (ex) {
    displayError(ex, templateContainer, templateEditor, templateError);
    return;
  }
  render(codegen.default(templatedSource, new codegen.FormattedCodeGen));
}

templateEditor.getSession().on('change', debounce(onChange, 300));
modifierEditor.getSession().on('change', debounce(onChange, 300));
scriptRadio.addEventListener('change', onChange);
moduleRadio.addEventListener('change', onChange);

document.addEventListener('DOMContentLoaded', onChange);