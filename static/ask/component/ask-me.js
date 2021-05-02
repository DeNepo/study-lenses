import { ask } from "../ask.js";

window.addEventListener("DOMContentLoaded", () => {
  class TraceIt extends HTMLElement {
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
        <div id='ask-container'>
          <button id='ask-button'>ask me</button>

          <div class="dropdown">
            <code>options</code>
            <div class='dropdown-content'>
              <form  id='ask-config'>
                <input id='variables' type='checkbox' /> <label for='variables'>variables</label> <br>
                <input id='data' type='checkbox' /> <label for='data'>data</label> <br>
                <input id='operators' type='checkbox' /> <label for='operators'>operators</label> <br>
                <input id='controlFlow' type='checkbox' /> <label for='controlFlow'>control flow</label> <br>
                <input id='functions' type='checkbox' /> <label for='functions'>functions</label> <br>
                <hr>
                level:
                <input type="range" min="1" max="4"  id="level">
              </form>
            </div>
          </div>
        </div>
        `;

      try {
        config.exists;
        if (
          config.locals &&
          config.locals.ask &&
          typeof config.locals.ask === "object"
        ) {
          for (const key in ask.config) {
            if (
              key === "level" &&
              typeof config.locals.ask.level === "number"
            ) {
              ask.config.level = config.locals.ask.level;
            } else if (typeof config.locals.ask[key] === "boolean") {
              ask.config[key].ask = config.locals.ask[key];
            }
          }
        }
      } catch (err) {
        // console.error(err);
      }

      shadow.getElementById("ask-button").addEventListener("click", (event) => {
        const questionObj = ask(editor.getValue());
        console.log(
          "\n--- --- --- --- --- --- ---\n\n" +
            questionObj.question +
            "\n\n--- --- --- --- --- --- ---"
        );
        event.preventDefault();
      });

      const askConfigEl = shadow.getElementById("ask-config");
      askConfigEl.addEventListener("change", (event) => {
        const option = event.target.id;

        if (typeof ask.config[option].ask === "boolean") {
          ask.config[option].ask = !ask.config[option].ask;
        } else if (event.target.type === "range") {
          ask.config.level = Number(event.target.value);
        }

        event.preventDefault();
      });

      for (const child of askConfigEl.children) {
        if (child.nodeName !== "INPUT") {
          continue;
        }
        if (ask.config[child.id]) {
          child.checked = ask.config[child.id].ask;
        }
      }

      shadow.getElementById("level").value = ask.config.level;
    }
  }
  customElements.define("ask-me", TraceIt);
});
