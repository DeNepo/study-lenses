
const randomizeVariables = (() => {

  const lowerCase = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  ]
  const validVariableCharacters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ]

  const randomVariableName = () => {
    const length = Math.floor((Math.random() * 5)) + 1
    let variableName = ''
    for (let i = 0; i < length; i++) {
      if (i === 0) {
        variableName += lowerCase[Math.floor(Math.random() * lowerCase.length)]
      } else {
        variableName += validVariableCharacters[Math.floor(Math.random() * validVariableCharacters.length)]
      }
    }
    return variableName
  }

  const reservedWords = ['await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'let', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'super', 'switch', 'static', 'this', 'throw', 'try', 'True', 'typeof', 'var', 'void', 'while', 'with', 'yield']

  const randomizeVariables = (code, probability = 0) => {

    const decomposed = decompose(code)

    const generatedVariables = []

    for (const line of decomposed) {
      const code = line.code
      for (let i = 0; i < code.length; i++) {
        const entry = code[i]
        if (Array.isArray(entry)
          && !reservedWords.includes(entry.join(''))
          && isNaN(entry.join(''))) {
          if (Math.random() > probability) {
            continue
          }
          let generatedVariableName = ''
          while (!generatedVariables.includes(generatedVariableName)) {
            generatedVariableName = randomVariableName()
            generatedVariables.push(generatedVariableName)
          }
          code[i] = generatedVariableName.split('')
        }
      }
    }

    const randomizedCode = recompose(decomposed)

    return randomizedCode
  }

  return randomizeVariables

})()
