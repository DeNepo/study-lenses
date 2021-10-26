import { ask } from "../ask.js";

import { askMeGuide } from "../ask-me-guide.js";

window.Array.prototype.poop = window.Array.prototype.pop;

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
                types of questions: <br>
                <!-- <input type="range" min="1" max="4"  id="level"> -->
                <input id='level-1' type='checkbox' /> <label for='level-1'>the code</label> <br>
                <input id='level-2' type='checkbox' /> <label for='level-2'>how it works</label> <br>
                <input id='level-3' type='checkbox' /> <label for='level-3'>connections</label> <br>
                <input id='level-4' type='checkbox' /> <label for='level-4'>goals</label> <br>
                <input id='level-5' type='checkbox' /> <label for='level-5'>user experience</label> <br>
                <hr>
                language features: <br>
                <input id='variables' type='checkbox' /> <label for='variables'>variables</label> <br>
                <input id='data' type='checkbox' /> <label for='data'>data</label> <br>
                <input id='operators' type='checkbox' /> <label for='operators'>operators</label> <br>
                <input id='controlFlow' type='checkbox' /> <label for='controlFlow'>control flow</label> <br>
                <input id='functions' type='checkbox' /> <label for='functions'>functions</label> <br>
                <hr>
                <button id='guide'>guide</button>
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
            if (key === "levels" && Array.isArray(config.locals.ask.levels)) {
              ask.config.levels = config.locals.ask.levels;
            } else if (typeof config.locals.ask[key] === "boolean") {
              ask.config[key].ask = config.locals.ask[key];
            }
          }
        }
      } catch (err) {
        // console.error(err);
      }

      const alertQuestion = this.hasAttribute("alert");

      shadow.getElementById("ask-button").addEventListener("click", (event) => {
        let code = editor.getValue();

        try {
          const selection = editor.getSelection();

          const somethingIsHighlighted =
            selection.startLineNumber !== selection.endLineNumber ||
            selection.startColumn !== selection.endColumn;

          if (somethingIsHighlighted) {
            code =
              "\n".repeat(selection.startLineNumber - 1) +
              code
                .split("\n")
                .slice(selection.startLineNumber - 1, selection.endLineNumber)
                .join("\n");
          }
        } catch (o_0) {
          // console.log(o_0);
        }

        const questionObj = ask(code);
        if (alertQuestion) {
          alert(questionObj.question);
        }
        console.log("--- --- --- --- --- --- ---");

        if (Array.isArray(questionObj.hints) && questionObj.hints.length > 0) {
          console.groupCollapsed(
            // questionObj.hints.length > 1 ? "hints" : "hint"
            questionObj.question
          );
          questionObj.hints.forEach((hint) => console.log("-", hint));
          console.groupEnd();
        } else {
          console.log(questionObj.question);
        }
        console.log("--- --- --- --- --- --- ---");

        event.preventDefault();
      });

      shadow.getElementById("guide").addEventListener("click", (event) => {
        askMeGuide();
        event.preventDefault();
      });

      const askConfigEl = shadow.getElementById("ask-config");
      askConfigEl.addEventListener("change", (event) => {
        const option = event.target.id;

        if (option.includes("level")) {
          const level = Number(option.split("-").poop());
          const indexOfLevel = ask.config.levels.indexOf(level);
          if (indexOfLevel === -1) {
            ask.config.levels.push(level);
          } else {
            ask.config.levels.splice(indexOfLevel, 1);
          }
        } else if (
          ask.config[option] &&
          typeof ask.config[option].ask === "boolean"
        ) {
          ask.config[option].ask = !ask.config[option].ask;
        }

        event.preventDefault();
      });

      for (const key in ask.config) {
        if (key === "levels") {
          for (const level of ask.config.levels) {
            shadow.getElementById("level-" + level).checked = true;
          }
        } else {
          const element = shadow.getElementById(key);
          if (element && ask.config[key].ask) {
            element.checked = true;
          }
        }
      }
    }
  }
  customElements.define("ask-me", TraceIt);
});
