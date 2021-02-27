'use strict';

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

var editor = ace.edit(document.querySelector('#demo1 .editor'));

var error = document.querySelector('#demo1 .error-message');
var output = document.querySelector('#demo1 .output');
var outputContainer = document.querySelector('#demo1 .output-container');

var radio = document.querySelector('#script-radio');
var radio2 = document.querySelector('#module-radio');

function displayError(exception) {
  unhighlight();
  hideError();
  error.textContent = exception.message;
  if (exception.line) {
    editor.getSession().setAnnotations([{
      row: exception.line - 1,
      column: exception.column,
      text: exception.message,
      type: 'error' // also warning and information
    }]);
  }
  outputContainer.classList.add('error');
}

function hideError() {
  outputContainer.classList.remove('error');
  editor.getSession().clearAnnotations();
}

function render(program) {
  hideError();
  output.innerHTML = program;
}

var session = editor.getSession();
editor.setBehavioursEnabled(false);
editor.setHighlightActiveLine(false);
editor.setOption('fontFamily', 'Source Code Pro');
editor.setOption('fontSize', '10pt');
editor.setShowPrintMargin(false);
editor.setTheme('ace/theme/textmate');
editor.setWrapBehavioursEnabled(false);
session.setMode('ace/mode/javascript');
session.setOption('useWorker', false);
session.setTabSize(2);
session.setUseSoftTabs(true);
session.setUseWrapMode(false);

var params = {};
location.search.replace(/[?&](\w+)=([^&]*)/g, function(match, param, value){ params[param] = decodeURIComponent(value); });
if ({}.hasOwnProperty.call(params, 'code')) {
  if ({}.hasOwnProperty.call(params, 'type') && (params.type === 'Module' || params.type === 'Script')) {
    (params.type === 'Script' ? radio : radio2).checked = true;
  }
  session.setValue(decodeURIComponent(params.code));
}


var lookup;
var identifiers = [];

function setHighlight(identifier) {
  var variable = lookup.lookup(identifier);
  if (variable.length > 1) {
    displayError({message: 'This token refers to multiple variables.'});
    return;
  } else if (variable.length === 0) {
    displayError({message: 'Couldn\'t locate corresponding variable.'});
    return;
  }
  variable[0].declarations.forEach(function(decl) {
    var id = identifiers.indexOf(decl.node);
    var ele = document.querySelector('span[data-identifier=\'' + id + '\']');
    ele.classList.add('var-decl');
  });
  variable[0].references.forEach(function(ref) {
    var id = identifiers.indexOf(ref.node);
    var ele = document.querySelector('span[data-identifier=\'' + id + '\']');
    if (ref.accessibility.isRead) {
      ele.classList.add('var-read');
    }
    if (ref.accessibility.isWrite) {
      ele.classList.add('var-write');
    }
    if (ref.accessibility.isDelete) {
      ele.classList.add('var-delete');
    }
  });
}

function unhighlight() {
  hideError();
  var eles = document.querySelectorAll('#demo1 .var-decl');
  for (var i = 0; i < eles.length; ++i) {
    eles[i].classList.remove('var-decl');
  }
  eles = document.querySelectorAll('#demo1 .var-write');
  for (var i = 0; i < eles.length; ++i) {
    eles[i].classList.remove('var-write');
  }
  eles = document.querySelectorAll('#demo1 .var-read');
  for (var i = 0; i < eles.length; ++i) {
    eles[i].classList.remove('var-read');
  }
  eles = document.querySelectorAll('#demo1 .var-delete');
  for (var i = 0; i < eles.length; ++i) {
    eles[i].classList.remove('var-delete');
  }
}

function mouseOverHandler(e) {
  var current = e.target;
  while (current && !(current.classList.contains('code-binding') || current.classList.contains('code-identifier'))) {
    current = current.parentElement;
  }
  if (current) {
    setHighlight(identifiers[current.dataset.identifier]);
  }
}
function mouseOutHandler(e) {
  unhighlight();
}
output.addEventListener('mouseover', mouseOverHandler);
output.addEventListener('mouseout', mouseOutHandler);

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function collectIdentifiers(globalScope, locations) {
  // returns the identifiers in source order.
  var identifiers = (function collect(scope) {
    var newIdentifiers = scope.variableList.reduce(function (acc, v) {
      return acc.concat(v.references.map(function (r) {
        return r.node;
      }), v.declarations.map(function (r) {
        return r.node;
      }));
    }, []);
    return [].concat.apply(newIdentifiers, scope.children.map(collect));
  }(globalScope));

  identifiers = identifiers.filter(function (v, i) {
    return i === identifiers.indexOf(v);
  });

  return identifiers.sort(function(a, b) {
    return locations.get(a).start.offset - locations.get(b).start.offset;
  });
}

function wrapIdentifiersInSpans(program, identifiers, locations) {
  // assumes identifiers are in source order.
  var out = '';
  var previousIndex = 0;
  for (var i = 0; i < identifiers.length; ++i) {
    var location = locations.get(identifiers[i]);
    out += escapeHTML(program.substring(previousIndex, location.start.offset));
    var idStr = program.substring(location.start.offset, location.end.offset);
    var trailingWhitespaceIndex = idStr.match(/\s*$/).index; // TODO this is a stupid hack pending https://github.com/shapesecurity/shift-parser-js/issues/363
    out += '<span class="code-binding" data-identifier="' + i + '">' + escapeHTML(idStr.substring(0, trailingWhitespaceIndex)) + '</span>' + idStr.substring(trailingWhitespaceIndex);
    previousIndex = location.end.offset;
  }
  out += escapeHTML(program.substring(previousIndex));
  return out;
}

function onChange() {
  var code = editor.getValue();
  var parseFn = radio.checked ? parser.parseScriptWithLocation : parser.parseModuleWithLocation;
  try {
    var treeAndLocations = parseFn(code);
    var tree = treeAndLocations.tree;
    var locations = treeAndLocations.locations;
    var globalScope = scope.default(tree);
    identifiers = collectIdentifiers(globalScope, locations);
    lookup = new scope.ScopeLookup(globalScope);
    render(wrapIdentifiersInSpans(code, identifiers, locations));
  } catch (ex) {
    displayError(ex);
    return;
  }
}

editor.getSession().on('change', debounce(onChange, 300));
radio.addEventListener('change', onChange);
radio2.addEventListener('change', onChange);

window.addEventListener('DOMContentLoaded', onChange);
