{
  const state = {
    looping: true,
  };

  const setup = (code) => {
    const errMsgCntId = "err-msg-cnt";
    try {
      const toRemove = document.getElementById(errMsgCntId);
      toRemove.parentElement.removeChild(toRemove);
    } catch (o_0) {
      // console.log(o_0);
    }
    const execute = eval;
    try {
      remove();
    } catch (o_0) {
      // console.log(o_0);
    }
    try {
      execute(code);
      new p5();
    } catch (err) {
      console.error(err);
      const errorMessageContainer = document.createElement("pre");
      errorMessageContainer.style =
        "color: firebrick; overflow: scroll; padding: 1em;";
      errorMessageContainer.innerHTML = `${err.name}: ${err.message}\n\n(see console for more callstack and more info)`;
      errorMessageContainer.id = errMsgCntId;
      const main = document.getElementsByTagName("main")[0];
      main.appendChild(errorMessageContainer);
    }
  };

  // initialize UI

  document
    .getElementById("restart-button")
    .addEventListener("click", () => setup(code));

  document.getElementById("loop-checkbox").addEventListener("click", () => {
    if (state.looping) {
      noLoop();
    } else {
      loop();
    }
    state.looping = !state.looping;
  });

  document.getElementById("debug-button").addEventListener("click", () => {
    setup("debugger;\n\n" + code);
  });

  setup(code);
}
