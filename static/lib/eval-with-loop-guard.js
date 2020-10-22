// deprecated, now using prettier directly in the browser

const evalWithLoopGuard = (code = '', max = 20, evalGuardedAndFormattedCode = eval) => {

  // using xhr so eval errors don't appear as "in promise"
  const xhr = new XMLHttpRequest();
  const loopGuarded = evalWithLoopGuard.insertLoopGuards(code, max)
  const paramConfig = {
    code: loopGuarded,
    ext: config.ext
  }
  const paramSafeConfig = encodeURIComponent(JSON.stringify(paramConfig))
  xhr.open('GET', window.location.origin + '?format=' + paramSafeConfig);
  xhr.responseType = 'text';
  xhr.send();
  xhr.onload = () => {
    if (xhr.status != 200) {
      // if there was an error in the format lense,
      //  then there is a syntax error in their code
      // eval their code for a proper error in the console
      //  and for VM code in the debugger
      // there should be no risk of infinite loops
      const evalSyntaxError = eval
      evalSyntaxError(code)
    } else {
      // if the formatting went well
      //  study with the provided function
      const formattedCode = xhr.response;
      evalGuardedAndFormattedCode(formattedCode)
    }
  }
  xhr.onerror = function (err) {
    console.error(err);
  }
}

evalWithLoopGuard.insertLoopGuards = (evalCode, maxIterations) => {
  let loopNum = 0
  return evalCode.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, loopHead => {
    const id = ++loopNum
    return `let loopGuard_${id} = 0\n${loopHead}\nif (++loopGuard_${id} > ${maxIterations}) { throw new RangeError('loopGuard_${id} is greater than ${maxIterations}') }\n`
  })
}
