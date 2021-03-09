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
                <input id='operators' type='checkbox' /> <label for='operators'>operators</label> <br>
                <input id='operatorsList' type='text' />  <br>
                <hr>
                <input id='controlFlow' type='checkbox'  /> <label for='controlFlow'>control flow</label> <br>
                <hr>
                <input id='functions' type='checkbox'  /> <label for='functions'>function calls</label> <br>
                <input id='functionsList' type='text' />  <br>
                <!-- <input id='this' type='checkbox'  /> <label for='this'>this</label> <br> -->
                <hr>
                from  <input id='rangeStart' style="width: 25%;" min="1" type='number' />  to <input id='rangeEnd' style="width: 25%;" min="1" type='number' /> <br>
                <hr>
                <input id='lines' type='checkbox' /> <label for='lines'>lines</label> <br>
                <input id='steps' type='checkbox' /> <label for='steps'>steps</label> <br>
                <input id='console' type='checkbox' /> <label for='console'>console</label> <br>
                <!-- <input id='interactions' type='checkbox' /> <label for='interactions'>interactions</label> <br> -->
              </form>
            </div>
          </div>
        </div>
        `;

        try {
          config.exists;
          trace.config =
            config.locals.trace && typeof config.locals.trace === "object"
              ? Object.assign(trace.config, config.locals.trace)
              : trace.config;
        } catch (err) {
          // console.error(err);
        }

        shadow
          .getElementById("trace-button")
          .addEventListener("click", (event) => {
            // trace is a global function
            trace(editor.getValue());
            // shadowStateHistory(this.editor.getValue());
            event.preventDefault();
          });

        const traceConfig = shadow.getElementById("trace-config");
        traceConfig.addEventListener("change", (event) => {
          const option = event.target.id;

          if (typeof trace.config[option] === "boolean") {
            trace.config[option] = !trace.config[option];
          } else if (option.toLowerCase().includes("list")) {
            trace.config[option] = event.target.value
              .split(",")
              .map((s) => s.trim());
          } else if (option.includes("range")) {
            trace.config.range[
              option.replace("range", "").toLowerCase()
            ] = Number(event.target.value);
          }

          event.preventDefault();
        });

        shadow.getElementById("rangeStart").value = trace.config.range.start;
        shadow.getElementById("rangeEnd").value = trace.config.range.end;

        for (const child of traceConfig.children) {
          if (child.nodeName !== "INPUT") {
            continue;
          }
          if (child.id.includes("List") || child.id.includes("range")) {
            continue;
          }
          if (trace.config[child.id]) {
            child.checked = trace.config[child.id];
          }
        }
      }
    }
  );
});
