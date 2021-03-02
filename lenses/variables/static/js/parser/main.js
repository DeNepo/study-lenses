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

var editor = ace.edit(document.querySelector("#demo1 .editor"));

var error = document.querySelector("#demo1 .error-message");
var output = document.querySelector("#demo1 .output");
var outputContainer = document.querySelector("#demo1 .output-container");

var scriptRadio = document.querySelector("#script-radio");
var moduleRadio = document.querySelector("#module-radio");

function displayError(exception) {
  hideError();
  error.textContent = exception.description;
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
  outputContainer.classList.add("error");
}

function hideError() {
  outputContainer.classList.remove("error");
  editor.getSession().clearAnnotations();
}

function render(ast) {
  hideError();
  output.display(ast);
}

editor.$blockScrolling = Infinity;
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

// legacy url support
var params = {};
location.search.replace(/[?&](\w+)=([^&]*)/g, function(match, param, value){ params[param] = decodeURIComponent(value); });
if ({}.hasOwnProperty.call(params, 'type') && (params.type === 'Module' || params.type === 'Script') && {}.hasOwnProperty.call(params, 'code')) {
  (params.type === 'Script' ? scriptRadio : moduleRadio).checked = true;
  session.setValue(params.code);
}

var params = {};
location.search.replace(/[?&](\w+)=([^&]*)/g, function(match, param, value){
  params[param] = decodeURIComponent(value);
});
if ('parse_type' in params) {
  (params.parse_type === 'script' ? scriptRadio : moduleRadio).checked = true;
}
if ('script' in params) {
  editor.setValue(params.script, -1);
}

function updateASTRendering() {
  var code = editor.getValue();
  var parseFn = scriptRadio.checked ? parser.parseScript : parser.parseModule;
  try {
    var ast = parseFn(code, { earlyErrors : true });
  } catch (ex) {
    displayError(ex);
    return;
  }

  render(ast);
}

function persistState() {
    var args = {
      parse_type: scriptRadio.checked ? 'script' : 'module',
      script: encodeURIComponent(editor.getValue()),
    };
    history.pushState({}, '', `?${Object.keys(args).map(name => `${name}=${args[name]}`).join('&')}`);
}

editor.getSession().on('change', debounce(function() {
  updateASTRendering();
  persistState();
}, 300));

scriptRadio.addEventListener('change', updateASTRendering);
scriptRadio.addEventListener('change', persistState);
moduleRadio.addEventListener('change', updateASTRendering);
moduleRadio.addEventListener('change', persistState);

document.addEventListener('WebComponentsReady', updateASTRendering);
