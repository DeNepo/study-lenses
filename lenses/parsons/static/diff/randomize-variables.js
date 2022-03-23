const randomizeVariables = (() => {
  const lowerCase = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  const validVariableCharacters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  const randomVariableName = () => {
    const length = Math.floor(Math.random() * 6) + 2;
    let variableName = '';
    for (let i = 0; i < length; i++) {
      if (i === 0) {
        variableName += lowerCase[Math.floor(Math.random() * lowerCase.length)];
      } else {
        variableName +=
          validVariableCharacters[
            Math.floor(Math.random() * validVariableCharacters.length)
          ];
      }
    }
    return variableName;
  };

  const keyWords = [
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'interface',
    'let',
    'new',
    'null',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'super',
    'switch',
    'static',
    'this',
    'throw',
    'try',
    'True',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'Set',
    'Map',
    'WeakSet',
    'WeakMap',
    'Function',
    'Array',
    'Object',
    'String',
    'Number',
    'Boolean',
    'of',
    'in',
    'async',
    'document',
    'Event',
    'isNaN',
    'true',
    'false',
    'undefined',
    'NaN',
    'Infinity',
    'console',
    'prompt',
    'alert',
    'confirm',
  ];

  /**
   *
   * @param {string} code - the code to extract from
   * @returns {string[]} an array of all strings that can be randomized
   */
  const extractRandomizeableTokens = (code) => {
    const decomposed = decompose(code);

    const randomizeable = new Set();

    for (const line of decomposed) {
      const code = line.code;
      for (const entry of code) {
        if (
          Array.isArray(entry) &&
          !keyWords.includes(entry.join('')) &&
          isNaN(entry.join(''))
        ) {
          randomizeable.add(entry.join(''));
        }
      }
    }

    // console.log(randomizeable);

    return Array.from(randomizeable);
  };

  /**
   *
   * @param {string[]} randomizeables - array of tokens from the code that can be randomized
   * @param {number} probability - the chance of randomizing each one
   * @returns {object} key/value map of each token to it's random replacement
   */
  const randomizeRandomizeable = (randomizeables, probability = 0) => {
    const randomizedMapping = {};

    const generatedVariables = [];

    for (const token of randomizeables) {
      if (Math.random() > probability) {
        continue;
      }
      let generatedVariableName = '';
      while (!generatedVariables.includes(generatedVariableName)) {
        generatedVariableName = randomVariableName();
        generatedVariables.push(generatedVariableName);
      }
      randomizedMapping[token] = generatedVariableName;
    }

    return randomizedMapping;
  };

  /**
   * randomizes non-key-word tokens.  all matching tokens are replaced with the same thing
   * @param {string} code - code to randomize
   * @param {number} probability the chance of randomizing allowed tokens
   * @returns {string} the code with selected tokens replaced
   * @example
   * const tree = 'oak';
   * console.log(tree);
   * // might become
   * const onEDwp = 'oak';
   * console.log(onEDwp);
   */
  const randomizeVariables = (code, probability = 0) => {
    const toRandomize = extractRandomizeableTokens(code);
    const randomizationMapping = randomizeRandomizeable(
      toRandomize,
      probability,
    );

    let randomizedCode = code;
    for (const key in randomizationMapping) {
      randomizedCode = randomizedCode
        .split(new RegExp(`(?<![\\w\\d_$])${key}(?![\\w\\d_$])`, 'gm'))
        .join(randomizationMapping[key]);
    }

    return randomizedCode;
  };

  return randomizeVariables;
})();
