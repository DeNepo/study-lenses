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







