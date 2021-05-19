{
  const state = {
    step: { delay: 0, timeoutId: 0, min: 0, max: 2500 },
    slow: { delay: 500, timeoutId: 0, min: 0, max: 500 },
    delayMin: 0,
    delayMax: 1500,
    frameRate: 0,
  };

  const controls = document.getElementById("controls");

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
      if (controls.how.value === "step") {
        stepByStep();
      } else if (controls.how.value === "slow") {
        runAtSpeed();
      } else if (controls.how.value === "pause") {
        noLoop();
      }
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

  controls.addEventListener("submit", (e) => e.preventDefault());

  document
    .getElementById("restart-button")
    .addEventListener("click", () => setup(code));

  // -------- pause ------------

  const pauseCheckbox = document.getElementById("pause");
  pauseCheckbox.addEventListener("click", () => {
    clearTimeout(state.slow.timeoutId);
    noLoop();
  });

  // -------- looping ----------

  const loopingCheckbox = document.getElementById("loop");
  loopingCheckbox.addEventListener("click", () => {
    loop();
  });

  // -------- debug ----------

  document.getElementById("debug-button").addEventListener("click", () => {
    setup("debugger;\n\n" + code);
  });

  // -------- step ----------

  const stepDelayInput = document.getElementById("delay-input");
  stepDelayInput.min = state.step.min;
  stepDelayInput.value = state.step.min;
  stepDelayInput.max = state.step.max;
  stepDelayInput.addEventListener("change", (event) => {
    state.step.delay = event.target.value;
  });

  const stepByStep = () => {
    loop();
    state.step.timeoutId = setTimeout(() => {
      noLoop();
      pauseCheckbox.checked = true;
    }, state.step.delay);
  };
  document.getElementById("step").addEventListener("click", stepByStep);

  // -------- slow ----------

  const runAtSpeed = () => {
    if (controls.how.value !== "slow") {
      return;
    }
    if (isLooping()) {
      noLoop();
    }
    redraw();
    state.slow.timeoutId = setTimeout(runAtSpeed, state.slow.delay);
  };

  const slowDelayInput = document.getElementById("slow-input");
  slowDelayInput.min = state.slow.min;
  slowDelayInput.value = state.slow.min;
  slowDelayInput.max = state.slow.max;
  slowDelayInput.addEventListener("change", (event) => {
    state.slow.delay = state.slow.max - event.target.value;
  });

  const slowInput = document.getElementById("slow");
  slowInput.addEventListener("change", runAtSpeed);

  setup(code);
}
