export const steamroll = function steamroll(code) {
  ("use strict;");

  /*

    a re-implementation of the classic fuckit.js https://github.com/mattdiamond/fuckitjs
    adapted for running small scripts in a sandboxed environment, ie. in classroom settings

    it can be very frustrating for students to encounter errors in their code
    so we will remove their errors and their code will always work
    learning === accelerated

    a full report of all errors and fixes will be captured and returned from steamroll
    this is useful for student self-reflection, data collection, or formative assessment
    you can also use these logs to generate worked examples of debugging

    > next steps: support asynchronous code

  */

  const comment = arguments.length === 2;

  const fsGiven = [];
  let improvements = 0;

  const isFed = (code, cesspool) =>
    function fedHandler({ lineno, error }) {
      const splitted = code.split("\n");
      const theProblem = splitted[lineno - 1];
      comment
        ? splitted.unshift(
            `// ${++improvements}. ${error.name}: ${
              error.message
            }\n//    ${splitted.splice(lineno - 1, 1)}\n`
          )
        : splitted.splice(lineno - 1, 1);
      const nextFToGive = splitted.join("\n");
      delete fsGiven[fsGiven.length - 1].goodCode;
      fsGiven[fsGiven.length - 1].badCode = code;
      fsGiven[fsGiven.length - 1].error = error;
      fsGiven[fsGiven.length - 1].guilty = theProblem;
      cesspool.contentDocument.body.appendChild(fit(nextFToGive));
    };

  const evalIt = (cesspool, code) =>
    function evalIt() {
      cesspool.contentWindow.addEventListener("error", isFed(code, cesspool));
      const fingersCrossed = document.createElement("script");
      fingersCrossed.innerHTML = `eval(decodeURI(\`${encodeURI(code)}\`))`;
      cesspool.contentDocument.body.appendChild(fingersCrossed);
    };

  const fit = (code) => {
    fsGiven.push({ goodCode: code });
    const cesspool = document.createElement("iframe");
    cesspool.addEventListener("load", evalIt(cesspool, code));
    cesspool.style.display = "none";
    return cesspool;
  };

  document.body.appendChild(fit(code));

  return fsGiven;
};
