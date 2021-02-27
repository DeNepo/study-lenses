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

var reducingEditor = ace.edit(document.querySelector("#reducing"));
var reducerEditor = ace.edit(document.querySelector("#reducer"));

var reducingContainer = document.querySelector("#reducing-container");
var reducerContainer = document.querySelector("#reducer-container");

var reducingError = document.querySelector("#reducing-container .error-message");
var reducerError = document.querySelector("#reducer-container .error-message");

var outputElement = document.querySelector("#output");
var output = ace.edit(outputElement);
var outputTree = document.querySelector("#demo1 .output-container .output") ;
var outputContainer = document.querySelector("#demo1 .output-container");

function displayError(exception, container, editor, error) {
  hideError(container, editor);
  error.textContent = exception.description || exception.message;
  console.dir(exception);
  if (exception.line) {
    editor.getSession().setAnnotations([{
      row: exception.line - 1,
      column: exception.column,
      text: exception.message,
      type: "error" // also warning and information
    }]);
  }
  container.classList.add("error");
}

function hideError(container, editor) {
  container.classList.remove("error");
  editor.getSession().clearAnnotations();
}

function render(ast, isText) {
  if (isText) {
    output.setValue(ast, -1);
  } else {
    outputTree.display(ast);
  }
}


reducingEditor.$blockScrolling = Infinity;
var reducingSession = reducingEditor.getSession();
reducingEditor.setBehavioursEnabled(false);
reducingEditor.setHighlightActiveLine(false);
reducingEditor.setOption("fontFamily", "Source Code Pro");
reducingEditor.setOption("fontSize", "10pt");
reducingEditor.setShowPrintMargin(false);
reducingEditor.setTheme("ace/theme/textmate");
reducingEditor.setWrapBehavioursEnabled(false);
reducingSession.setMode("ace/mode/javascript");
reducingSession.setOption("useWorker", false);
reducingSession.setTabSize(2);
reducingSession.setUseSoftTabs(true);
reducingSession.setUseWrapMode(false);

reducerEditor.$blockScrolling = Infinity;
var reducerSession = reducerEditor.getSession();
reducerEditor.setBehavioursEnabled(false);
reducerEditor.setHighlightActiveLine(false);
reducerEditor.setOption("fontFamily", "Source Code Pro");
reducerEditor.setOption("fontSize", "10pt");
reducerEditor.setShowPrintMargin(false);
reducerEditor.setTheme("ace/theme/textmate");
reducerEditor.setWrapBehavioursEnabled(false);
reducerSession.setMode("ace/mode/javascript");
reducerSession.setOption("useWorker", false);
reducerSession.setTabSize(2);
reducerSession.setUseSoftTabs(true);
reducerSession.setUseWrapMode(false);

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

var scriptRadio = document.querySelector("#script-radio");
var moduleRadio = document.querySelector("#module-radio");

var lastExecutedProgram;

var cachedReducer = {};

var reducerDisplayingScript = void 0;

var params = {};
location.search.replace(/[?&](\w+)=([^&]*)/g, function(match, param, value){
  params[param] = decodeURIComponent(value);
});
if ('reducing_type' in params) {
  (params.reducing_type === 'script' ? scriptRadio : moduleRadio).checked = true;
}
if ('reducing' in params) {
  reducingEditor.setValue(params.reducing, -1);
}
if ('reducer' in params) {
  reducerEditor.setValue(params.reducer, -1);
}

var isLoaded = false;

function onChange() {
  hideError(reducingContainer, reducingEditor);
  hideError(reducerContainer, reducerEditor);
  var reducing = reducingEditor.getValue();
  var reducerProgram = reducerEditor.getValue();
  var evaluatedReducer = cachedReducer[reducerProgram];
  if (evaluatedReducer === void 0) {
    try {
      parser.parseScript(reducerProgram, { earlyErrors : true }); // check parse errors, otherwise we don't get reliable location information
      evaluatedReducer = (function() {
        var Shift = ast;
        var {reduce, thunkedReduce, thunkify, thunkifyClass, memoize, CloneReducer, LazyCloneReducer, MonoidalReducer, ThunkedMonoidalReducer, adapt, PlusReducer, ThunkedPlusReducer, ConcatReducer, ThunkedConcatReducer, AndReducer, ThunkedAndReducer, OrReducer, ThunkedOrReducer } = reducer;
        return eval(reducerProgram);
      })() || {}
      cachedReducer[reducerProgram] = evaluatedReducer;
    } catch (ex) {
      displayError(ex, reducerContainer, reducerEditor, reducerError);
      render(ex.toString(), true);
      return;
    }
  }
  if (isLoaded) {
    var args = {
      reducing_type: scriptRadio.checked ? 'script' : 'module',
      reducing: encodeURIComponent(reducingEditor.getValue()),
      reducer: encodeURIComponent(reducerEditor.getValue()),
    };
    history.pushState({}, '', `?${Object.keys(args).map(name => `${name}=${args[name]}`).join('&')}`);
  }
  isLoaded = true;
  var returnedValue = null;
  try {
    var parsed = (moduleRadio.checked ? parser.parseModule : parser.parseScript)(reducing, { earlyErrors : true });
    var reduced = reducer.reduce(new evaluatedReducer, parsed);
    if (typeof reduced === 'object' && (reduced.type === 'Module' || reduced.type === 'Script')) {
      returnedValue = codegen.default(reduced, new codegen.FormattedCodeGen);
      if (reducerDisplayingScript === void 0 || !reducerDisplayingScript) {
        outputElement.classList.remove('hidden');
        outputTree.classList.add('hidden');
      }
      reducerDisplayingScript = true;
    } else {
      returnedValue = reduced;
      if (reducerDisplayingScript === void 0 || reducerDisplayingScript) {
        outputTree.classList.remove('hidden');
        outputElement.classList.add('hidden');
      }
      reducerDisplayingScript = false;
    }
  } catch (ex) {
    displayError(ex, reducingContainer, reducingEditor, reducingError);
    render(ex.toString(), true);
    return;
  }
  render(returnedValue, reducerDisplayingScript);
}

reducingEditor.getSession().on('change', debounce(onChange, 300));
reducerEditor.getSession().on('change', debounce(onChange, 300));
scriptRadio.addEventListener('change', onChange);
moduleRadio.addEventListener('change', onChange);

document.addEventListener('DOMContentLoaded', onChange);