window.addEventListener("DOMContentLoaded", () => {
  customElements.define(
    "trace-it",
    class extends HTMLElement {
      connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
        <style>
          .panel-element {
            display: inline-block;
          }

          .dropdown {
            /* width: 100%; */
            position: relative;
            display: inline-block;
          }

          .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            padding: 12px 16px;
            z-index: 100;
          }

          .dropdown:hover .dropdown-content {
            display: block;
          }
        </style>
        <div id='trace-container'>
          <button id='trace-button'>trace</button>

          <div class="dropdown">
            <code>options</code>
            <div class='dropdown-content'>
              <form  id='trace-config'>
                variables:  <input id='variablesList' type='text' />  <br>
                <input id='variablesDeclare' type='checkbox' /> <label for='variablesDeclare'>declare</label> <br>
                <input id='variablesRead' type='checkbox' /> <label for='variablesRead'>read</label> <br>
                <input id='variablesAssign' type='checkbox' /> <label for='variablesAssign'>assign</label> <br>
                <hr>
                <input id='operators' type='checkbox' /> <label for='operators'>operators:</label> <br>
                <input id='operatorsList' type='text' />  <br>
                <hr>
                <input id='controlFlow' type='checkbox'  /> <label for='controlFlow'>control flow:</label>
                <input id='controlFlowList' type='text' />  <br>
                <!-- <input id='controlFlow' type='checkbox'  /> <label for='controlFlow'>checks</label> <br> -->
                <input id='controlFlowErrorHandling' type='checkbox'  /> <label for='controlFlowErrorHandling'>error handling</label>
                <hr>
                <input id='functions' type='checkbox'  /> <label for='functions'>function calls:</label> <input id='functionsList' type='text' />  <br>
                <!-- <input id='functions' type='checkbox'  /> <label for='functions'>function calls</label> <br>
                <input id='functionDeclarations' type='checkbox'  /> <label for='functionDeclarations'>declarations</label> <br> -->
                <input id='this' type='checkbox'  /> <label for='this'>this</label> <br>
                <hr>
                <!-- from  <input id='rangeStart' style="width: 25%;" min="1" type='number' />  to <input id='rangeEnd' style="width: 25%;" min="1" type='number' /> <br>
                <hr> -->
                <input id='lines' type='checkbox' /> <label for='lines'>lines</label> <br>
                <input id='steps' type='checkbox' /> <label for='steps'>steps</label> <br>
                <input id='console' type='checkbox' /> <label for='console'>console</label> <br>
                <!-- <input id='interactions' type='checkbox' /> <label for='interactions'>interactions</label> <br> -->
              </form>
            </div>
          </div>
        </div>
        `;
        setTimeout(() => {
          try {
            config.exists;
            Object.assign(traceConfig, config.locals.trace);
          } catch (err) {
            // console.error(err);
          }
          // console.log(traceConfig);

          try {
            !trace.editor && typeof trace.editor.getValue !== "function";
          } catch (err) {
            editor.exists;
            trace.editor = editor;
            // console.error(err);
          }

          // hack until event is default in refactor
          // const useEvent = this.hasAttribute("event");

          shadow
            .getElementById("trace-button")
            .addEventListener("click", (event) => {
              // trace is a global function
              // console.log(trace.editor.getValue());
              const code = trace.editor.getValue();

              const selection = trace.editor.getSelection();

              const nothingIsHighlighted =
                selection.startLineNumber === selection.endLineNumber &&
                selection.startColumn === selection.endColumn;

              if (nothingIsHighlighted) {
                traceConfig.range.start = 1;
                traceConfig.range.end = code.split("\n").length;
              } else {
                traceConfig.range.start = selection.startLineNumber;
                traceConfig.range.end = selection.endLineNumber;
              }

              // if (useEvent) {
              //   this.dispatchEvent(
              //     new CustomEvent("study", {
              //       bubbles: true,
              //       detail: { selection: false, value },
              //     })
              //   );
              // } else {
              trace(code);
              // }
              event.preventDefault();
            });

          const traceConfigEl = shadow.getElementById("trace-config");
          traceConfigEl.addEventListener("change", (event) => {
            const option = event.target.id;

            if (typeof traceConfig[option] === "boolean") {
              traceConfig[option] = !traceConfig[option];
            } else if (option.toLowerCase().includes("list")) {
              const trimmedList = event.target.value
                .split(",")
                .map((s) => s.trim());
              const newList =
                trimmedList.length === 1 && trimmedList[0] === ""
                  ? []
                  : trimmedList;
              traceConfig[option] = newList;
            } else if (option.includes("range")) {
              traceConfig.range[option.replace("range", "").toLowerCase()] =
                Number(event.target.value);
            }

            event.preventDefault();
          });

          // shadow.getElementById("rangeStart").value = traceConfig.range.start;
          // shadow.getElementById("rangeEnd").value = traceConfig.range.end;

          for (const child of traceConfigEl.children) {
            if (child.nodeName !== "INPUT") {
              continue;
            }
            if (child.id.includes("List") || child.id.includes("range")) {
              continue;
            }
            if (traceConfig[child.id]) {
              child.checked = traceConfig[child.id];
            }
          }
        }, 500);
      }
    }
  );
});
