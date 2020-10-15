const { mangler, shuffle, replace, decompose, recompose, pipe } = (() => {



  const decompose = (codeString) => {
    const splitByNewline = codeString.split('\n');

    const lines = [];

    // separate indentation from code
    for (const line of splitByNewline) {
      let codeIndex = 0;
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        if (!line[charIndex].match(/^\s+$/)) {
          codeIndex = charIndex;
          break;
        }
      }
      const nextLine = {
        indent: line.slice(0, codeIndex),
        code: line.slice(codeIndex, line.length)
      }
      lines.push(nextLine);
    };
    // console.log(JSON.parse(JSON.stringify(lines)))

    // decompose code string into arrays of token chars and syntax
    for (const line of lines) {
      const code = line.code;
      line.code = [];

      // keep non-token substrings as strings
      // split token substrings into arrays of chars
      for (let i = 0; i < code.length; i++) {
        const character = code[i];
        const isTokenChar = character.match(/^[a-zA-Z0-9_\$]*$/);

        if (isTokenChar && !Array.isArray(line.code[line.code.length - 1])) {
          line.code.push([]);
          line.code[line.code.length - 1].push(character);
        }
        else if (isTokenChar && Array.isArray(line.code[line.code.length - 1])) {
          line.code[line.code.length - 1].push(character);
        }
        else if (!isTokenChar && typeof line.code[line.code.length - 1] === 'string') {
          line.code[line.code.length - 1] += character;
        }
        else if (!isTokenChar && typeof line.code[line.code.length - 1] !== 'string') {
          line.code.push('');
          line.code[line.code.length - 1] += character;
        }
      }
    }
    // console.log(JSON.parse(JSON.stringify(lines)))

    return lines;
  };

  // // decomposed code looks like this:
  // // this modeling will make it "simple" to:
  // //   shuffle non-syntax characters, tokens, lines, or indentation
  // //   blankify non-syntax characters, tokens, lines, or indentation
  // // all without breaking the syntactic structure of a line
  // [
  //   {
  //     indent: '',
  //     code: [['f', 'o', 'r'], ' (', ['l', 'e', 't']]
  //   },
  //   {
  //     indent: '  ',
  //     code: [['c', 'o', 'n', 's', 't'], ' ', ['e', 'e', 'l'], ' = "',['e','e','l'], ';"' ]
  //   },
  // ]

  const recompose = (decomposed) => {
    const stringedCode = [];
    for (const line of decomposed) {
      let code = '';
      for (const entry of line.code) {
        if (Array.isArray(entry)) {
          code += entry.join('');
        } else {
          code += entry;
        }
      }
      stringedCode.push({
        indent: line.indent,
        code
      });
    }

    const code = stringedCode
      .map((line) => line.indent + line.code)
      .join('\n');


    return code;
  };


  const mangler = {
    characters: (mixer, probability = 0.1) =>
      (decomposed) => {
        for (let i = 0; i < decomposed.length; i++) {
          const line = decomposed[i].code;
          for (let j = 0; j < line.length; j++) {
            if (Array.isArray(line[j])) {
              line[j] = mixer(line[j], probability);
            }
          }
        }
        return decomposed
      },
    tokens: (mixer, probability = 0.1) =>
      (decomposed) => {
        for (let i = 0; i < decomposed.length; i++) {
          const line = decomposed[i].code;
          const indices = [];
          for (let i = 0; i < line.length; i++) {
            if (Array.isArray(line[i])) {
              indices.push(i);
            }
          }
          const toProcess = line
            .filter(entry => {
              return Array.isArray(entry);
            });
          const processed = mixer(toProcess, probability);
          for (let i = 0; i < processed.length; i++) {
            line[indices[i]] = processed[i];
          }
        };
        return decomposed
      },
    lines: (mixer, probability = 0.1) =>
      (decomposed) => {
        const emissary = decomposed.map((_, index) => index);
        const messed = mixer(emissary, probability);
        const processed = [];
        for (let i = 0; i < messed.length; i++) {
          if (typeof messed[i] === 'number') {
            processed[i] = decomposed[messed[i]];
          } else {
            processed[i] = {
              indent: '',
              code: [messed[i]]
            }
          }
        }
        return processed;
      },
    indents: (mixer, probability = 0.1) =>
      (decomposed) => {
        const emissary = decomposed.map((_, index) => index);
        const messed = mixer(emissary, probability);
        const processed = JSON.parse(JSON.stringify(decomposed));
        for (let i = 0; i < messed.length; i++) {
          if (typeof messed[i] === 'number') {
            processed[i].indent = decomposed[messed[i]].indent;
          } else {
            processed[i].indent = [messed[i]];
          }
        }
        return processed;
      },
    code: (mixer, probability = 0.1) =>
      (decomposed) => {
        const emissary = decomposed.map((_, index) => index);
        const messed = mixer(emissary, probability);
        const processed = JSON.parse(JSON.stringify(decomposed));
        for (let i = 0; i < messed.length; i++) {
          if (typeof messed[i] === 'number') {
            processed[i].code = decomposed[messed[i]].code;
          } else {
            processed[i].code = [messed[i]];
          }
        }
        return processed;
      },
  };




  // https://blog.codinghorror.com/the-danger-of-naivete/
  const shuffle = (array, probability = 0.1) => {
    const toShuffle = JSON.parse(JSON.stringify(array));
    for (let i = array.length - 1; i > 0; i--) {
      const randomNumber = Math.random();
      if (randomNumber < probability) {
        const newIndex = Math.floor(Math.random() * toShuffle.length);
        const currentItem = toShuffle[i];
        toShuffle[i] = toShuffle[newIndex];
        toShuffle[newIndex] = currentItem;
      }
    }
    return toShuffle;
  };
  // console.log(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.5));

  const replace = (array, probability = 0.1, replacer = String.fromCharCode(183)) => { // ·
    const replaced = [];
    for (let i = 0; i < array.length; i++) {
      const nextEntry = Math.random() < probability
        ? replacer
        : array[i];
      replaced.push(nextEntry);
    };
    return replaced;
  };
  // console.log(replace([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.5));


  const pipe = (decomposed, arrOfFunctions) => {
    return arrOfFunctions
      .reduce((piped, nextFunction) => {
        return nextFunction(piped);
      }, decomposed);
  };

  return {
    mangler,
    shuffle,
    replace,
    decompose,
    recompose,
    pipe
  };

})();









const diffSelection = (config) => (editor) => {


  const code = getSelection(editor);
  if (!code) {
    alert('no code selected');
    return;
  }



  // const pathSplitByDot = window.location.pathname.split('.');
  // const fileExtension = pathSplitByDot[pathSplitByDot.length - 1];
  const languageMap = {
    'js': 'javascript',
    'ts': 'typescript'
  }
  const language = config.language


  let commentless = strip(code).replace(new RegExp('(\n){2,}', 'gim'), '\n\n').trim();
  if (commentless[commentless.length - 1] === '\n') {
    commentless = commentless.slice(0, commentless.length - 1);
  }

  const toScramble = monaco.editor.createModel(commentless, language);
  // const toScramble = monaco.editor.createModel(recompose(decompose(code)), language);
  toScramble.updateOptions({ tabSize: 2 });
  const source = monaco.editor.createModel(commentless, language);
  // const source = monaco.editor.createModel(code, language);
  source.updateOptions({ tabSize: 2 });

  const diffContainer = document.createElement("div");
  const diffEditor = monaco.editor.createDiffEditor(diffContainer, {
    roundedSelection: true,
    scrollBeyondLastLine: false,
    theme: "vs-dark",
    wrappingIndent: "indent",
    wordWrap: 'wordWrapColumn',
    wordWrapColumn: 100,
    automaticLayout: true,
    originalEditable: true, // for left pane
    readOnly: true, // for right side
    enableSplitViewResizing: false,
    ignoreTrimWhitespace: false,
  });
  diffEditor.setModel({
    original: toScramble,
    modified: source
  });

  diffEditor.style = 'height:90vh; width:100vw;';

  const modalId = Math.random().toString(36).substring(7);
  const modalContainer = document.createElement('div');
  modalContainer.id = modalId;
  modalContainer.style = 'height:90vh; width:100vw;';
  modalContainer.className = 'modal-window';
  modalContainer.innerHTML = `<div>
        <a href="#modal-close" title="Close" class="modal-close">close &times;</a>
        <br>
        <br>
        <p class='panel-element'>
          shuffle: <br>
          replace:
        </p>
        <style>
          .panel {
            display: flex;
            flex-direction: row;
          }
        </style>
        <form id='diff-selection-form' class='panel'>
          <div class='panel-element'>
            indents: <br>
            <input name='indents-shuffle' min='0' max='100' type='range' value='0' /> <br>
            <input name='indents-replace' min='0' max='100' type='range' value='0' /> <br>
          </div>
          <div class='panel-element'>
            code: <br>
            <input name='code-shuffle' min='0' max='100' type='range' value='0' /> <br>
            <input name='code-replace' min='0' max='100' type='range' value='0' /> <br>
          </div>
          <div class='panel-element'>
            lines: <br>
            <input name='lines-shuffle' min='0' max='100' type='range' value='0' /> <br>
            <input name='lines-replace' min='0' max='100' type='range' value='0' /> <br>
          </div>
          <div class='panel-element'>
            tokens: <br>
            <input name='tokens-shuffle' min='0' max='100' type='range' value='0' /> <br>
            <input name='tokens-replace' min='0' max='100' type='range' value='0' /> <br>
          </div>
          <div class='panel-element'>
            characters: <br>
            <input name='characters-shuffle' min='0' max='100' type='range' value='0' /> <br>
            <input name='characters-replace' min='0' max='100' type='range' value='0' /> <br>
          </div>
        </form>

      </div>`;
  modalContainer.firstElementChild.appendChild(diffContainer);
  modalContainer.firstElementChild.style = 'height:90vh; width:100vw;';
  modalContainer.firstElementChild.firstElementChild.addEventListener('click', () => document.body.removeChild(modalContainer));
  document.body.appendChild(modalContainer);
  const url = location.href;
  location.href = "#" + modalId;
  history.replaceState(null, null, url);


  // document.getElementById('format-code').addEventListener('click', () => dif.trigger('anyString', 'editor.action.formatDocument'));


  document.getElementById('diff-selection-form').onchange = (event) => {
    const inputs = Array.from(event.currentTarget.getElementsByTagName('input'));

    const nonZeroInputs = inputs.filter(input => input.value !== '0');

    const scale = (value) => Math.pow(100, (value / 200)) / 10;
    // subset, mixer, percentage
    const mixupParameters = nonZeroInputs.map(input => {
      const splitName = input.name.split('-');
      return [splitName[0], splitName[1], scale(Number(input.value))];
    });

    const transformations = mixupParameters.map(parameter => {
      const mixitup = mangler[parameter[0]];
      if (parameter[1] === 'shuffle') {
        return mixitup(shuffle, parameter[2]);
      } else {
        return mixitup(replace, parameter[2]);
      }
    });

    // const log = (thing) => (console.log(thing), thing);
    const log = (thing) => thing;
    toScramble.setValue(recompose(log(pipe(log(decompose(commentless)), transformations))));

  }

}

