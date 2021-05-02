/* adapted for JS

  distractors are marked by JS comments //
  indentation no longer follows python conventions
    instead students have to replicate original indentation

  search for "hack" in this file to find the changes

*/

// refactored to remove underscore
//  https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_isFunction

// (function ($, _) { // wrap in anonymous function to not show some helper variables // descore
(function ($) {
  // wrap in anonymous function to not show some helper variables

  const interceptorFactory = (intercept) =>
    function (thing) {
      intercept(thing);
      return thing;
    };
  const log = interceptorFactory(console.trace);

  // regexp used for trimming
  var trimRegexp = /^\s*(.*?)\s*$/;
  var translations = {
    fi: {
      trash_label: "Raahaa rivit ohjelmaasi tästä",
      solution_label: "Muodosta ratkaisusi tähän",
      order: function () {
        return "Ohjelma sisältää vääriä palasia tai palasten järjestys on väärä. Tämä on mahdollista korjata siirtämällä, poistamalla tai vaihtamalla korostettuja palasia.";
      },
      lines_missing: function () {
        return "Ohjelmassasi on liian vähän palasia, jotta se toimisi oikein.";
      },
      lines_too_many: function () {
        return "Ohjelmassasi on liian monta palasta, jotta se toimisi oikein.";
      },
      no_matching: function (lineNro) {
        return (
          "Korostettu palanen (" +
          lineNro +
          ") on sisennetty kieliopin vastaisesti."
        );
      },
      no_matching_open: function (lineNro, block) {
        return (
          "Rivillä " +
          lineNro +
          " päätettävää " +
          block +
          " lohkoa ei ole aloitettu."
        );
      },
      no_matching_close: function (lineNro, block) {
        return block + " lohkoa riviltä " + lineNro + " ei ole päätetty.";
      },
      block_close_mismatch: function (
        closeLine,
        closeBlock,
        openLine,
        inBlock
      ) {
        return (
          "Ei voi päättää lohkoa " +
          closeBlock +
          " rivillä " +
          closeLine +
          " oltaessa vielä lohkossa " +
          inBlock +
          " riviltä " +
          openLine
        );
      },
      block_structure: function (lineNro) {
        return (
          "Korostettu palanen (" +
          lineNro +
          ") on sisennetty väärään koodilohkoon."
        );
      },
      unittest_error: function (errormsg) {
        return (
          "<span class='msg'>Virhe ohjelman jäsentämisessä/suorituksessa</span><br/> <span class='errormsg'>" +
          errormsg +
          "</span>"
        );
      },
      unittest_output_assertion: function (expected, actual) {
        return (
          "Odotettu tulostus: <span class='expected output'>" +
          expected +
          "</span>" +
          "Ohjelmasi tulostus: <span class='actual output'>" +
          actual +
          "</span>"
        );
      },
      unittest_assertion: function (expected, actual) {
        return (
          "Odotettu arvo: <span class='expected'>" +
          expected +
          "</span><br>" +
          "Ohjelmasi antama arvo: <span class='actual'>" +
          actual +
          "</span>"
        );
      },
      variabletest_assertion: function (varname, expected, actual) {
        return (
          "Muuttujan " +
          varname +
          " odotettu arvo: <span class='expected'>" +
          expected +
          "</span> " +
          "Ohjelmasi antama arvo: <span class='actual'>" +
          actual +
          "</span>"
        );
      },
    },
    en: {
      trash_label: "Drag from here",
      solution_label: "Construct your solution here",
      order: function () {
        return "Code fragments in your program are wrong, or in wrong order. This can be fixed by moving, removing, or replacing highlighted fragments.";
      },
      lines_missing: function () {
        return "Your program has too few code fragments.";
      },
      lines_too_many: function () {
        return "Your program has too many code fragments.";
      },
      no_matching: function (lineNro) {
        return (
          "Based on language syntax, the highlighted fragment (" +
          lineNro +
          ") is not correctly indented."
        );
      },
      no_matching_open: function (lineNro, block) {
        return "The " + block + " ended on line " + lineNro + " never started.";
      },
      no_matching_close: function (lineNro, block) {
        return (
          "Block " +
          block +
          " defined on line " +
          lineNro +
          " not ended properly"
        );
      },
      block_close_mismatch: function (
        closeLine,
        closeBlock,
        openLine,
        inBlock
      ) {
        return (
          "Cannot end block " +
          closeBlock +
          " on line " +
          closeLine +
          " when still inside block " +
          inBlock +
          " started on line " +
          openLine
        );
      },
      block_structure: function (lineNro) {
        return (
          "The highlighted fragment " +
          lineNro +
          " belongs to a wrong block (i.e. indentation)."
        );
      },
      unittest_error: function (errormsg) {
        return (
          "<span class='msg'>Error in parsing/executing your program</span><br/> <span class='errormsg'>" +
          errormsg +
          "</span>"
        );
      },
      unittest_output_assertion: function (expected, actual) {
        return (
          "Expected output: <span class='expected output'>" +
          expected +
          "</span>" +
          "Output of your program: <span class='actual output'>" +
          actual +
          "</span>"
        );
      },
      unittest_assertion: function (expected, actual) {
        return (
          "Expected value: <span class='expected'>" +
          expected +
          "</span><br>" +
          "Actual value: <span class='actual'>" +
          actual +
          "</span>"
        );
      },
      variabletest_assertion: function (varname, expected, actual) {
        return (
          "Expected value of variable " +
          varname +
          ": <span class='expected'>" +
          expected +
          "</span><br>" +
          "Actual value: <span class='actual'>" +
          actual +
          "</span>"
        );
      },
    },
  };

  // Different graders

  var graders = {};

  /*
    graders/variable-check.js
  */

  /*
    graders/turtle.js
  */

  /*
    graders/unit-test.js
  */

  /*
    graders/language-translation.js
  */

  // The "original" grader for giving line based feedback.
  var LineBasedGrader = function (parson) {
    this.parson = parson;
  };
  graders.LineBasedGrader = LineBasedGrader;
  LineBasedGrader.prototype.grade = function (options, elementId) {
    options = options || {};
    var parson = this.parson;
    var elemId = elementId || parson.options.sortableId;
    // js hack: don't normalize student code indents - students must replicate indentation
    //  js isn't white-space sensitive
    // var student_code = parson.normalizeIndents(parson.getModifiedCode("#ul-" + elemId));
    var student_code = parson.getModifiedCode("#ul-" + elemId);
    var lines_to_check = Math.min(
      student_code.length,
      parson.model_solution.length
    );
    var errors = [],
      log_errors = [];
    var incorrectLines = [],
      studentCodeLineObjects = [];
    var i;
    var wrong_order = false;

    // Find the line objects for the student's code
    for (i = 0; i < student_code.length; i++) {
      studentCodeLineObjects.push(
        $.extend(true, {}, parson.getLineById(student_code[i].id))
      );
    }

    // This maps codeline strings to the index, at which starting from 0, we have last
    // found this codeline. This is used to find the best indices for each
    // codeline in the student's code for the LIS computation and, for example,
    // assigns appropriate indices for duplicate lines.
    var lastFoundCodeIndex = {};
    $.each(studentCodeLineObjects, function (index, lineObject) {
      // find the first matching line in the model solution
      // starting from where we have searched previously
      for (
        var i =
          typeof lastFoundCodeIndex[lineObject.code] !== "undefined"
            ? lastFoundCodeIndex[lineObject.code] + 1
            : 0;
        i < parson.model_solution.length;
        i++
      ) {
        if (parson.model_solution[i].code === lineObject.code) {
          // found a line in the model solution that matches the student's line
          lastFoundCodeIndex[lineObject.code] = i;
          lineObject.lisIgnore = false;
          // This will be used in LIS computation
          lineObject.position = i;
          break;
        }
      }
      if (i === parson.model_solution.length) {
        if (typeof lastFoundCodeIndex[lineObject.code] === "undefined") {
          // Could not find the line in the model solution at all,
          // it must be a distractor
          // => add to feedback, log, and ignore in LIS computation
          wrong_order = true;
          !options.skipHighlight && lineObject.markIncorrectPosition();
          incorrectLines.push(lineObject.orig);
          lineObject.lisIgnore = true;
        } else {
          // The line is part of the solution but there are now
          // too many instances of the same line in the student's code
          // => Let's just have their correct position to be the same
          // as the last one actually found in the solution.
          // LIS computation will handle such duplicates properly and
          // choose only one of the equivalent positions to the LIS and
          // extra duplicates are left in the inverse and highlighted as
          // errors.
          // TODO This method will not always give the most intuitive
          // highlights for lines to supposed to be moved when there are
          // several extra duplicates in the student's code.
          lineObject.lisIgnore = false;
          lineObject.position = lastFoundCodeIndex[lineObject.code];
        }
      }
    });

    var lisStudentCodeLineObjects = studentCodeLineObjects.filter(function (
      lineObject
    ) {
      return !lineObject.lisIgnore;
    });
    var inv = LIS.best_lise_inverse_indices(
      lisStudentCodeLineObjects.map(function (lineObject) {
        return lineObject.position;
      })
    );
    $.each(inv, function (_index, lineObjectIndex) {
      // Highlight the lines that could be moved to fix code as defined by the LIS computation
      !options.skipHighlight &&
        lisStudentCodeLineObjects[lineObjectIndex].markIncorrectPosition();
      incorrectLines.push(lisStudentCodeLineObjects[lineObjectIndex].orig);
    });
    if (inv.length > 0 || incorrectLines.length > 0) {
      wrong_order = true;
      log_errors.push({ type: "incorrectPosition", lines: incorrectLines });
    }

    if (wrong_order) {
      errors.push(parson.translations.order());
    }

    // Check the number of lines in student's code
    if (parson.model_solution.length < student_code.length) {
      !options.skipHighlight && $("#ul-" + elemId).addClass("incorrect");
      errors.push(parson.translations.lines_too_many());
      log_errors.push({ type: "tooManyLines", lines: student_code.length });
    } else if (parson.model_solution.length > student_code.length) {
      !options.skipHighlight && $("#ul-" + elemId).addClass("incorrect");
      errors.push(parson.translations.lines_missing());
      log_errors.push({ type: "tooFewLines", lines: student_code.length });
    }

    // Finally, check indent if no other errors
    // hack: highlight all indentation errors since they don't cause errors
    if (errors.length === 0) {
      for (i = 0; i < lines_to_check; i++) {
        var code_line = student_code[i];
        var model_line = parson.model_solution[i];
        // if (code_line.indent !== model_line.indent &&
        //   ((!parson.options.first_error_only) || errors.length === 0)) {
        if (code_line.indent !== model_line.indent) {
          !options.skipHighlight && code_line.markIncorrectIndent();
          errors.push(parson.translations.block_structure(i + 1));
          log_errors.push({ type: "incorrectIndent", line: i + 1 });
        }
        // if (code_line.code == model_line.code &&
        //   code_line.indent == model_line.indent &&
        //   errors.length === 0) {
        if (
          code_line.code == model_line.code &&
          code_line.indent == model_line.indent
        ) {
          !options.skipHighlight && code_line.markCorrect();
        }
      }
    }

    return {
      errors: errors,
      log_errors: log_errors,
      success: errors.length === 0,
    };
  };

  var python_indents = [],
    spaces = "";
  for (var counter = 0; counter < 20; counter++) {
    python_indents[counter] = spaces;
    spaces += "  ";
  }

  var defaultToggleTypeHandlers = {
    boolean: ["True", "False"],
    compop: ["<", ">", "<=", ">=", "==", "!="],
    mathop: ["+", "-", "*", "/"],
    boolop: ["and", "or"],
    range: function ($item) {
      var min = parseFloat($item.data("min") || "0"),
        max = parseFloat($item.data("max") || "10"),
        step = parseFloat($item.data("step") || "1"),
        opts = [],
        curr = min;
      while (curr <= max) {
        opts.push("" + curr);
        curr += step;
      }
      return opts;
    },
  };
  var addToggleableElements = function (widget, states) {
    states = states || {};
    for (var i = 0; i < widget.modified_lines.length; i++) {
      widget.modified_lines[i]._addToggles();
    }
    // toggleable elements are only enabled for unit tests
    if (!widget.options.unittests && !widget.options.vartests) {
      return;
    }
    var handlers = $.extend(
      defaultToggleTypeHandlers,
      widget.options.toggleTypeHandlers
    );
    var trashContext = $("#" + widget.options.trashId);
    var sortableContext = $("#" + widget.options.sortableId);

    var updateToggles = function (context, states) {
      $(".jsparson-toggle", context).each(function (index, item) {
        if (states && states[index]) {
          $(item).text(states[index]);
        }
        var type = $(item).data("type");
        if (!type) {
          return;
        }
        var handler = handlers[type],
          jspOptions;
        if ($.isFunction(handler)) {
          jspOptions = handler($(item));
        } else {
          jspOptions = handler;
        }
        if (jspOptions && $.isArray(jspOptions)) {
          $(item).attr("data-jsp-options", JSON.stringify(jspOptions));
        }
      });
    };
    updateToggles(trashContext, states.input);
    updateToggles(sortableContext, states.output);
    // register a click handler for all the toggleable elements (and unregister existing)
    trashContext
      .add(sortableContext)
      .off("click", ".jsparson-toggle")
      .on("click", ".jsparson-toggle", function () {
        var $this = $(this),
          curVal = $this.text(),
          choices = $this.data("jsp-options"),
          newVal = choices[(choices.indexOf(curVal) + 1) % choices.length],
          $parent = $this.parent("li");
        // clear existing feedback
        widget.clearFeedback();
        // change the shown toggle element
        $this.text(newVal);
        // log the event
        widget.addLogEntry({
          type: "toggle",
          oldvalue: curVal,
          newvalue: newVal,
          target: $parent[0].id,
          toggleindex: $parent.find(".jsparson-toggle").index($this),
        });
      });
  };

  // Create a line object skeleton with only code and indentation from
  // a code string of an assignment definition string (see parseCode)
  var ParsonsCodeline = function (codestring, widget) {
    this.widget = widget;
    this.code = "";
    this.indent = 0;
    this._toggles = [];
    if (codestring) {
      // Consecutive lines to be dragged as a single block of code have strings "\\n" to
      // represent newlines => replace them with actual new line characters "\n"
      // hack - use JS comments
      // this.code = codestring.replace(/#distractor\s*$/, "").replace(trimRegexp, "$1").replace(/\\n/g, "\n");
      this.code = codestring
        .replace(/\/\/( |\t)+distractor\s*$/, "")
        .replace(/\/\/distractor\s*$/, "")
        .replace(trimRegexp, "$1")
        .replace(/\\n/g, "\n");
      this.indent = codestring.length - codestring.replace(/^\s+/, "").length;
    }
  };
  ParsonsCodeline.prototype.elem = function () {
    // the element will change on shuffle, so we should re-fetch it every time
    return $("#" + this.id);
  };
  ParsonsCodeline.prototype.markCorrect = function () {
    this.elem().addClass(this.widget.FEEDBACK_STYLES.correctPosition);
  };
  ParsonsCodeline.prototype.markIncorrectPosition = function () {
    this.elem().addClass(this.widget.FEEDBACK_STYLES.incorrectPosition);
  };
  ParsonsCodeline.prototype.markIncorrectIndent = function () {
    this.elem().addClass(this.widget.FEEDBACK_STYLES.incorrectIndent);
  };
  //
  ParsonsCodeline.prototype._addToggles = function () {
    var toggleRegexp = new RegExp(
      "\\$\\$toggle(" + this.widget.options.toggleSeparator + ".*?)?\\$\\$",
      "g"
    );
    var toggles = this.code.match(toggleRegexp);
    var that = this;
    this._toggles = [];
    if (toggles) {
      var html = this.code;
      for (var i = 0; i < toggles.length; i++) {
        var opts = toggles[i]
          .substring(10, toggles[i].length - 2)
          .split(this.widget.options.toggleSeparator);
        html = html.replace(
          toggles[i],
          "<span class='jsparson-toggle' data-jsp-options='" +
            JSON.stringify(opts).replace("<", "&lt;") +
            "'></span>"
        );
      }
      this.elem().html(html);
      this.elem()
        .find(".jsparson-toggle")
        .each(function (index, item) {
          that._toggles.push(item);
        });
    }
  };
  // Returns the number of toggleable elements in this code block
  ParsonsCodeline.prototype.toggleCount = function () {
    return this._toggles.length;
  };
  // Returns the index of the currently selected toggle option for the
  // toggle element at given index
  ParsonsCodeline.prototype.selectedToggleIndex = function (index) {
    if (index < 0 || index >= this._toggles.length) {
      return -1;
    }
    var elem = this._toggles[index];
    var opts = $(elem).data("jsp-options");
    return opts.indexOf(elem.textContent);
  };
  // Returns the value of the toggleable element at the given index (0-based)
  ParsonsCodeline.prototype.toggleValue = function (index) {
    if (index < 0 || index >= this._toggles.length) {
      return undefined;
    }
    return this._toggles[index].textContent;
  };
  // expose the type for testing, extending etc
  window.ParsonsCodeline = ParsonsCodeline;

  // Creates a parsons widget. Init must be called after creating an object.
  var ParsonsWidget = function (options) {
    // Contains line objects of the user-draggable code.
    // The order is not meaningful (unchanged from the initial state) but
    // indent property for each line object is updated as the user moves
    // codelines around. (see parseCode for line object description)
    this.modified_lines = [];
    // contains line objects of distractors (see parseCode for line object description)
    this.extra_lines = [];
    // contains line objects (see parseCode for line object description)
    this.model_solution = [];

    //To collect statistics, feedback should not be based on this
    this.user_actions = [];

    //State history for feedback purposes
    this.state_path = [];
    this.states = {};

    var defaults = {
      incorrectSound: false,
      x_indent: 50,
      can_indent: true,
      feedback_cb: false,
      first_error_only: true,
      max_wrong_lines: 10,
      lang: "en",
      toggleSeparator: "::",
    };

    this.options = jQuery.extend({}, defaults, options);
    this.feedback_exists = false;
    this.id_prefix = options["sortableId"] + "codeline";
    if (translations.hasOwnProperty(this.options.lang)) {
      this.translations = translations[this.options.lang];
    } else {
      this.translations = translations["en"];
    }

    // translate trash_label and solution_label
    if (!this.options.hasOwnProperty("trash_label")) {
      this.options.trash_label = this.translations.trash_label;
    }
    if (!this.options.hasOwnProperty("solution_label")) {
      this.options.solution_label = this.translations.solution_label;
    }
    this.FEEDBACK_STYLES = {
      correctPosition: "correctPosition",
      incorrectPosition: "incorrectPosition",
      correctIndent: "correctIndent",
      incorrectIndent: "incorrectIndent",
    };

    // use grader passed as an option if defined and is a function
    // if (this.options.grader && _.isFunction(this.options.grader)) { // descore
    if (
      this.options.grader &&
      (this.options.grader && typeof this.options.grader === "function"
        ? true
        : false)
    ) {
      this.grader = new this.options.grader(this);
    } else {
      // initialize the grader
      if (typeof this.options.unittests !== "undefined") {
        /// unittests are specified
        this.grader = new UnitTestGrader(this);
      } else if (typeof this.options.vartests !== "undefined") {
        /// tests for variable values
        this.grader = new VariableCheckGrader(this);
      } else {
        // "traditional" parson feedback
        this.grader = new LineBasedGrader(this);
      }
    }
  };
  ParsonsWidget._graders = graders;

  ////Public methods

  // hack - copied this in from variable grader for the "debug solution" button
  ParsonsWidget.prototype.getStudentCode = function () {
    var student_code = this.parson.getModifiedCode(
      "#ul-" + this.parson.options.sortableId
    );
    var executableCode = "";
    $.each(student_code, function (index, item) {
      // dequery
      // Array.from(student_code).forEach(function (item) {
      // split codeblocks on br elements
      var lines = $("#" + item.id)
        .html()
        .split(/<br\s*\/?>/); // dequery
      // var lines = document.getElementById(item.id).innerHTML.split(/<br\s*\/?>/);
      // go through all the lines
      for (var i = 0; i < lines.length; i++) {
        // add indents and get the text for the line (to remove the syntax highlight html elements)
        executableCode +=
          python_indents[item.indent] +
          $("<span>" + lines[i] + "</span>").text() +
          "\n"; // dequery
        // not yet dequeried because won't be using variable check grader
      }
    });
    return executableCode;
  };

  // Parses an assignment definition given as a string and returns and
  // transforms this into an object defining the assignment with line objects.
  //
  // lines: A string that defines the solution to the assignment and also
  //   any possible distractors
  // max_distractrors: The number of distractors allowed to be included with
  //   the lines required in the solution
  ParsonsWidget.prototype.parseCode = function (lines, max_distractors) {
    var distractors = [],
      indented = [],
      widgetData = [],
      lineObject,
      errors = [],
      that = this;
    // Create line objects out of each codeline and separate
    // lines belonging to the solution and distractor lines
    // Fields in line objects:
    //   code: a string of the code, may include newline characters and
    //     thus in fact represents a block of consecutive lines
    //   indent: indentation level, -1 for distractors
    //   distractor: boolean whether this is a distractor
    //   orig: the original index of the line in the assignment definition string,
    //     for distractors this is not meaningful but for lines belonging to the
    //     solution, this is their expected position
    $.each(lines, function (index, item) {
      lineObject = new ParsonsCodeline(item, that);
      lineObject.orig = index;
      // hack: js comments
      // if (item.search(/#distractor\s*$/) >= 0) {
      if (
        item.search(/\/\/( |\t)+distractor\s*$/) >= 0 ||
        item.search(/\/\/distractor\s*$/) >= 0
      ) {
        // This line is a distractor
        lineObject.indent = -1;
        lineObject.distractor = true;
        if (lineObject.code.length > 0) {
          // The line is non-empty, not just whitespace
          distractors.push(lineObject);
        }
      } else {
        // This line is part of the solution
        // Initialize line object with code and indentation properties
        if (lineObject.code.length > 0) {
          // The line is non-empty, not just whitespace
          lineObject.distractor = false;
          indented.push(lineObject);
        }
      }
    });

    var normalized = this.normalizeIndents(indented);

    $.each(normalized, function (index, item) {
      if (item.indent < 0) {
        // Indentation error
        errors.push(this.translations.no_matching(normalized.orig));
      }
      widgetData.push(item);
    });

    // Remove extra distractors if there are more alternative distrators
    // than should be shown at a time
    var permutation = this.getRandomPermutation(distractors.length);
    var selected_distractors = [];
    for (var i = 0; i < max_distractors; i++) {
      selected_distractors.push(distractors[permutation[i]]);
      widgetData.push(distractors[permutation[i]]);
    }

    return {
      // an array of line objects specifying  the solution
      solution: $.extend(true, [], normalized),
      // an array of line objects specifying the requested number
      // of distractors (not all possible alternatives)
      distractors: $.extend(true, [], selected_distractors),
      // an array of line objects specifying the initial code arrangement
      // given to the user to use in constructing the solution
      widgetInitial: $.extend(true, [], widgetData),
      errors: errors,
    };
  };

  ParsonsWidget.prototype.init = function (text) {
    // TODO: Error handling, parseCode may return errors in an array in property named errors.
    var initial_structures = this.parseCode(
      text.split("\n"),
      this.options.max_wrong_lines
    );
    this.model_solution = initial_structures.solution;
    this.extra_lines = initial_structures.distractors;
    this.modified_lines = initial_structures.widgetInitial;
    var id_prefix = this.id_prefix;

    // Add ids to the line objects in the user-draggable lines
    $.each(this.modified_lines, function (index, item) {
      item.id = id_prefix + index;
      item.indent = 0;
    });
  };

  ParsonsWidget.prototype.getHash = function (searchString) {
    var hash = [],
      ids = $(searchString).sortable("toArray"),
      line;
    for (var i = 0; i < ids.length; i++) {
      line = this.getLineById(ids[i]);
      hash.push(line.orig + "_" + line.indent);
    }
    //prefix with something to handle empty output situations
    if (hash.length === 0) {
      return "-";
    } else {
      return hash.join("-");
    }
  };

  ParsonsWidget.prototype.solutionHash = function () {
    return this.getHash("#ul-" + this.options.sortableId);
  };

  ParsonsWidget.prototype.trashHash = function () {
    return this.getHash("#ul-" + this.options.trashId);
  };

  ParsonsWidget.prototype.whatWeDidPreviously = function () {
    var hash = this.solutionHash();
    var previously = this.states[hash];
    if (!previously) {
      return undefined;
    }
    var visits =
      this.state_path.filter(function (state) {
        return state == hash;
      }).length - 1;
    var i,
      stepsToLast = 0,
      s,
      outputStepTypes = ["removeOutput", "addOutput", "moveOutput"];
    for (i = this.state_path.length - 2; i > 0; i--) {
      s = this.states[this.state_path[i]];
      if (s && outputStepTypes.indexOf(s.type) != -1) {
        stepsToLast++;
      }
      if (hash === this.state_path[i]) {
        break;
      }
    }
    return $.extend(
      false,
      { visits: visits, stepsToLast: stepsToLast },
      previously
    );
  };

  /**
   * Returns states of the toggles for logging purposes
   */
  ParsonsWidget.prototype._getToggleStates = function () {
    var context = $(
        "#" + this.options.sortableId + ", #" + this.options.trashId
      ),
      toggles = $(".jsparson-toggle", context),
      toggleStates = {};
    $("#" + this.options.sortableId + " .jsparson-toggle").each(function () {
      if (!toggleStates.output) {
        toggleStates.output = [];
      }
      toggleStates.output.push($(this).text());
    });
    if (this.options.trashId) {
      toggleStates.input = [];
      $("#" + this.options.trashId + " .jsparson-toggle").each(function () {
        toggleStates.input.push($(this).text());
      });
    }
    if (
      (toggleStates.output && toggleStates.output.length > 0) ||
      (toggleStates.input && toggleStates.input.length > 0)
    ) {
      return toggleStates;
    } else {
      return undefined;
    }
  };

  ParsonsWidget.prototype.addLogEntry = function (entry) {
    var state, previousState;
    var logData = {
      time: new Date(),
      output: this.solutionHash(),
      type: "action",
    };

    if (this.options.trashId) {
      logData.input = this.trashHash();
    }

    if (entry.target) {
      entry.target = entry.target.replace(this.id_prefix, "");
    }

    // add toggle states to log data if there are toggles
    var toggles = this._getToggleStates();
    if (toggles) {
      logData.toggleStates = toggles;
    }

    state = logData.output;

    jQuery.extend(logData, entry);
    this.user_actions.push(logData);

    //Updating the state history
    if (this.state_path.length > 0) {
      previousState = this.state_path[this.state_path.length - 1];
      this.states[previousState] = logData;
    }

    //Add new item to the state path only if new and previous states are not equal
    if (this.state_path[this.state_path.length - 1] !== state) {
      this.state_path.push(state);
    }
    // callback for reacting to actions
    if ($.isFunction(this.options.action_cb)) {
      this.options.action_cb.call(this, logData);
    }
  };

  /**
   * Update indentation of a line based on new coordinates
   * leftDiff horizontal difference from (before and after drag) in px
   ***/
  ParsonsWidget.prototype.updateIndent = function (leftDiff, id) {
    var code_line = this.getLineById(id);
    var new_indent = this.options.can_indent
      ? code_line.indent + Math.floor(leftDiff / this.options.x_indent)
      : 0;
    new_indent = Math.max(0, new_indent);
    code_line.indent = new_indent;

    return new_indent;
  };

  // Get a line object by the full id including id prefix
  // (see parseCode for description of line objects)
  ParsonsWidget.prototype.getLineById = function (id) {
    var index = -1;
    for (var i = 0; i < this.modified_lines.length; i++) {
      if (this.modified_lines[i].id == id) {
        index = i;
        break;
      }
    }
    return this.modified_lines[index];
  };

  // Check and normalize code indentation.
  // Does not use the current object (this) ro make changes to
  // the parameter.
  // Returns a new array of line objects whose indent fields' values
  // may be different from the argument. If indentation does not match,
  // i.e. code is malformed, value of indent may be -1.
  // For example, the first line may not be indented.
  ParsonsWidget.prototype.normalizeIndents = function (lines) {
    // hack: normalize to least-indented line, not the first
    //  js isn't white-space sensitive so there should be no penalty
    //  intead students must replicate the initial indentation

    if (lines.length === 0) {
      const normalizedLines = [];
      for (var i = 0; i < lines.length; i++) {
        new_line = jQuery.extend({}, lines[i]);
        normalizedLines.push(new_line);
      }
      return normalizedLines;
    }

    const rawIndents = lines.map((line) => line.indent);
    const indentMaps = rawIndents.map((val, ind) => [ind, val]);
    indentMaps.sort((a, b) => a[1] - b[1]);

    let currentNorm = 0;
    let lastVal = indentMaps[0][1];
    const normalizedMaps = indentMaps.map((map) => {
      if (map[1] > lastVal) {
        currentNorm += 1;
        lastVal = map[1];
      }
      return [map[0], currentNorm];
    });

    const normalizedIndents = new Array(lines.length);
    for (const map of normalizedMaps) {
      normalizedIndents[map[0]] = map[1];
    }

    const normalizedLines = [];
    for (var i = 0; i < lines.length; i++) {
      new_line = jQuery.extend({}, lines[i]);
      new_line.indent = normalizedIndents[i];
      normalizedLines[i] = new_line;
    }

    return normalizedLines;
  };

  /**
   * Retrieve the code lines based on what is in the DOM
   *
   * TODO(petri) refactor to UI
   * */
  ParsonsWidget.prototype.getModifiedCode = function (search_string) {
    //ids of the the modified code
    var lines_to_return = [],
      solution_ids = $(search_string).sortable("toArray"),
      i,
      item;
    for (i = 0; i < solution_ids.length; i++) {
      item = this.getLineById(solution_ids[i]);
      lines_to_return.push($.extend(new ParsonsCodeline(), item));
    }
    return lines_to_return;
  };

  ParsonsWidget.prototype.hashToIDList = function (hash) {
    var lines = [];
    var lineValues;
    var lineObject;
    var h;

    if (hash === "-" || hash === "" || hash === null) {
      h = [];
    } else {
      h = hash.split("-");
    }

    var ids = [];
    for (var i = 0; i < h.length; i++) {
      lineValues = h[i].split("_");
      ids.push(this.modified_lines[lineValues[0]].id);
    }
    return ids;
  };

  ParsonsWidget.prototype.updateIndentsFromHash = function (hash) {
    var lineValues;
    var h;

    if (hash === "-" || hash === "" || hash === null) {
      h = [];
    } else {
      h = hash.split("-");
    }

    var ids = [];
    for (var i = 0; i < h.length; i++) {
      lineValues = h[i].split("_");
      this.modified_lines[lineValues[0]].indent = Number(lineValues[1]);
      this.updateHTMLIndent(this.modified_lines[lineValues[0]].id);
    }
    return ids;
  };

  /**
   * TODO(petri) refoctor to UI
   */
  ParsonsWidget.prototype.displayError = function (message) {
    if (this.options.incorrectSound && $.sound) {
      $.sound.play(this.options.incorrectSound);
    }
    alert(message);
  };

  ParsonsWidget.prototype.colorFeedback = function (elemId) {
    return new LineBasedGrader(this).grade(null, elemId);
  };

  /**
   * @return
   * TODO(petri): Separate UI from here
   */
  ParsonsWidget.prototype.getFeedback = function () {
    this.feedback_exists = true;
    var fb = this.grader.grade();
    if (this.options.feedback_cb) {
      this.options.feedback_cb(fb); //TODO(petri): what is needed?
    }
    // if answer is correct, mark it in the UI
    if (fb.success) {
      $("#ul-" + this.options.sortableId).addClass("correct");
    }
    // log the feedback and return; based on the type of grader
    if ("html" in fb) {
      // unittest/vartests type feedback
      this.addLogEntry({
        type: "feedback",
        tests: fb.tests,
        success: fb.success,
      });
      return { feedback: fb.html, success: fb.success };
    } else {
      this.addLogEntry({
        type: "feedback",
        errors: fb.log_errors,
        success: fb.success,
      });
      return fb.errors;
    }
  };

  ParsonsWidget.prototype.clearFeedback = function () {
    if (this.feedback_exists) {
      $("#ul-" + this.options.sortableId).removeClass("incorrect correct");
      var li_elements = $("#ul-" + this.options.sortableId + " li");
      $.each(this.FEEDBACK_STYLES, function (index, value) {
        li_elements.removeClass(value);
      });
    }
    this.feedback_exists = false;
  };

  ParsonsWidget.prototype.getRandomPermutation = function (n) {
    var permutation = [];
    var i;
    for (i = 0; i < n; i++) {
      permutation.push(i);
    }
    var swap1, swap2, tmp;
    for (i = 0; i < n; i++) {
      swap1 = Math.floor(Math.random() * n);
      swap2 = Math.floor(Math.random() * n);
      tmp = permutation[swap1];
      permutation[swap1] = permutation[swap2];
      permutation[swap2] = tmp;
    }
    return permutation;
  };

  ParsonsWidget.prototype.shuffleLines = function () {
    var permutation = (this.options.permutation
      ? this.options.permutation
      : this.getRandomPermutation)(this.modified_lines.length);
    var idlist = [];
    for (var i in permutation) {
      idlist.push(this.modified_lines[permutation[i]].id);
    }
    if (this.options.trashId) {
      this.createHTMLFromLists([], idlist);
    } else {
      this.createHTMLFromLists(idlist, []);
    }
    addToggleableElements(this);
  };

  ParsonsWidget.prototype.createHTMLFromHashes = function (
    solutionHash,
    trashHash,
    toggleStates
  ) {
    var solution = this.hashToIDList(solutionHash);
    var trash = this.hashToIDList(trashHash);
    this.createHTMLFromLists(solution, trash);
    this.updateIndentsFromHash(solutionHash);
    addToggleableElements(this, toggleStates);
  };

  ParsonsWidget.prototype.updateHTMLIndent = function (codelineID) {
    var line = this.getLineById(codelineID);
    $("#" + codelineID).css(
      "margin-left",
      this.options.x_indent * line.indent + "px"
    );
  };

  ParsonsWidget.prototype.codeLineToHTML = function (codeline) {
    // return '<li id="' + codeline.id + '" class="prettyprint lang-py">' + codeline.code + '<\/li>'; // hack
    // https://stackoverflow.com/a/24631113
    function escapeHTML(string) {
      var pre = document.createElement("pre");
      var text = document.createTextNode(string);
      pre.appendChild(text);
      return pre.innerHTML;
    }
    `<pre><code class="language-css">p { color: red }</code></pre>`;
    return (
      '<li id="' +
      codeline.id +
      `"><pre class="language-${this.options.language} no-line-numbers" style="font-size: 70%;"><code>` +
      escapeHTML(codeline.code) +
      "</code></pre></li>"
    );
    // return '<li id="' + codeline.id + `"><pre class="language-${this.options.language} no-line-numbers" style="font-size: 70%;"><code>` + (this.options.language === 'html' ? escapeHTML(codeline.code) : codeline.code) + '</code></pre></li>';
    // return '<li id="' + codeline.id + `" class="prettyprint lang-${this.options.language}">` + (this.options.language === 'html' ? escapeHTML(codeline.code) : codeline.code) + '</li>';
  };

  ParsonsWidget.prototype.codeLinesToHTML = function (
    codelineIDs,
    destinationID
  ) {
    var lineHTML = [];
    for (var id in codelineIDs) {
      var line = this.getLineById(codelineIDs[id]);
      lineHTML.push(this.codeLineToHTML(line));
    }
    return '<ul id="ul-' + destinationID + '">' + lineHTML.join("") + "</ul>";
  };

  /** modifies the DOM by inserting exercise elements into it */
  ParsonsWidget.prototype.createHTMLFromLists = function (
    solutionIDs,
    trashIDs
  ) {
    var html;
    if (this.options.trashId) {
      html =
        (this.options.trash_label
          ? "<p>" + this.options.trash_label + "</p>"
          : "") + this.codeLinesToHTML(trashIDs, this.options.trashId);
      $("#" + this.options.trashId).html(html);
      html =
        (this.options.solution_label
          ? "<p>" + this.options.solution_label + "</p>"
          : "") + this.codeLinesToHTML(solutionIDs, this.options.sortableId);
      $("#" + this.options.sortableId).html(html);
    } else {
      html = this.codeLinesToHTML(solutionIDs, this.options.sortableId);
      $("#" + this.options.sortableId).html(html);
    }

    // allow to use https://github.com/google/code-prettify/
    // var prettyPrint = window.PR.prettyPrint || window.prettyPrint;
    // hack - js styling with Prism
    // if (prettyPrint && (typeof (this.options.prettyPrint) === "undefined" || this.options.prettyPrint)) {
    if (this.options.trashId) {
      // prettyPrint(null, $("#" + this.options.trashId).get(0));
      Prism.highlightAllUnder($("#" + this.options.trashId).get(0)); // hack
    }
    if (this.options.sortableId) {
      // prettyPrint(null, $("#" + this.options.sortableId).get(0));
      Prism.highlightAllUnder($("#" + this.options.sortableId).get(0)); // hack
    }
    // }

    var that = this;
    var sortable = $("#ul-" + this.options.sortableId).sortable({
      start: function () {
        that.clearFeedback();
      },
      stop: function (event, ui) {
        if ($(event.target)[0] != ui.item.parent()[0]) {
          return;
        }
        that.updateIndent(
          ui.position.left - ui.item.parent().position().left,
          ui.item[0].id
        );
        that.updateHTMLIndent(ui.item[0].id);
        that.addLogEntry({ type: "moveOutput", target: ui.item[0].id }, true);
      },
      receive: function (event, ui) {
        var ind = that.updateIndent(
          ui.position.left - ui.item.parent().position().left,
          ui.item[0].id
        );
        that.updateHTMLIndent(ui.item[0].id);
        that.addLogEntry({ type: "addOutput", target: ui.item[0].id }, true);
      },
      grid: that.options.can_indent ? [that.options.x_indent, 1] : false,
    });
    sortable.addClass("output");

    if (this.options.trashId) {
      var trash = $("#ul-" + this.options.trashId).sortable({
        connectWith: sortable,
        start: function () {
          that.clearFeedback();
        },
        receive: function (event, ui) {
          that.getLineById(ui.item[0].id).indent = 0;
          that.updateHTMLIndent(ui.item[0].id);
          that.addLogEntry(
            { type: "removeOutput", target: ui.item[0].id },
            true
          );
        },
        stop: function (event, ui) {
          if ($(event.target)[0] != ui.item.parent()[0]) {
            // line moved to output and logged there
            return;
          }
          that.addLogEntry({ type: "moveInput", target: ui.item[0].id }, true);
        },
      });
      sortable.sortable("option", "connectWith", trash);
    }
    // Log the original codelines in the exercise in order to be able to
    // match the input/output hashes to the code later on. We need only a
    // few properties of the codeline objects
    var bindings = [];
    for (var i = 0; i < this.modified_lines.length; i++) {
      var line = this.modified_lines[i];
      bindings.push({ code: line.code, distractor: line.distractor });
    }
    this.addLogEntry({ type: "init", time: new Date(), bindings: bindings });
  };

  ParsonsWidget.prototype.getStudentCode = function () {
    var repeatStringNumTimes = function (string, times) {
      var repeatedString = "";
      while (times > 0) {
        repeatedString += string;
        times--;
      }
      return repeatedString;
    };

    var student_code = this.normalizeIndents(
      this.getModifiedCode("#ul-" + this.options.sortableId)
    );

    var lines = [];
    var sortableContainer = $("#ul-" + this.options.sortableId);
    $.each(student_code, function (index, item) {
      var text = sortableContainer.find("#" + item.id).text();
      var indents = repeatStringNumTimes("  ", item.indent);
      lines.push(indents + text);
    });
    return lines.join("\n");
  };

  window["ParsonsWidget"] = ParsonsWidget;
})(
  // allows _ and $ to be modified with noconflict without changing the globals
  // that parsons uses
  // )($, _); // descore
  $
);
