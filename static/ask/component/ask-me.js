import { ask } from '../open-ended/ask.js';
// import { generate } from '../multiple-choice/index.js';
import { askOpenEnded, askMultipleChoice } from './ask-questions.js';
import { openEndedPanel, multipleChoicePanel } from './options-panels.js';

import { askMeGuide } from '../open-ended/guide.js';
import { config } from '../config.js';

window.addEventListener('DOMContentLoaded', () => {
  class TraceIt extends HTMLElement {
    questionType = 'openEnded';

    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });
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
            <div id="options-panel-container" class='dropdown-content'>
              <!-- <form id="question-type-form">
                <input type="radio" id="openEnded" name="questionType" value="openEnded" checked>
                <label for="openEnded">open ended</label>
                <br>
                <input type="radio" id="multipleChoice" name="questionType" value="multipleChoice">
                <label for="multipleChoice">multiple choice</label>
              </form>
              <hr> -->
              ${openEndedPanel}
              <!-- ${multipleChoicePanel} -->
            </div>
          </div>
        </div>
        `;

      try {
        window.config.exists;
        if (
          window.config.locals &&
          window.config.locals.ask &&
          typeof window.config.locals.ask === 'object'
        ) {
          for (const key in ask.config) {
            if (
              key === 'levels' &&
              Array.isArray(window.config.locals.ask.levels)
            ) {
              ask.config.levels = window.config.locals.ask.levels;
            } else if (typeof window.config.locals.ask[key] === 'boolean') {
              ask.config[key].ask = window.config.locals.ask[key];
            }
          }
        }
      } catch (err) {
        // console.error(err);
      }

      if (this.hasAttribute('alert')) {
        ask.config.alert.ask = true;
      }

      // shadow
      //   .getElementById('question-type-form')
      //   .addEventListener('change', (event) => {
      //     this.questionType = event.path[0].id;
      //     if (this.questionType === 'multipleChoice') {
      //       shadow.getElementById('ask-open-ended-config').style.display =
      //         'none';
      //       shadow.getElementById('ask-multiple-choice-config').style.display =
      //         'block';
      //     } else {
      //       shadow.getElementById('ask-open-ended-config').style.display =
      //         'block';
      //       shadow.getElementById('ask-multiple-choice-config').style.display =
      //         'none';
      //     }
      //   });

      shadow.getElementById('ask-button').addEventListener('click', (event) => {
        let code = editor.getValue();

        const selection = editor.getSelection();

        const somethingIsHighlighted =
          selection.startLineNumber !== selection.endLineNumber ||
          selection.startColumn !== selection.endColumn;

        if (this.questionType === 'openEnded') {
          try {
            if (somethingIsHighlighted) {
              config.openEnded.range.start = selection.startLineNumber;
              config.openEnded.range.end = selection.endLineNumber;
            } else {
              config.openEnded.range.start = 0;
              config.openEnded.range.end = code.split('\n').length;
            }
          } catch (o_0) {
            // console.log(o_0);
          }

          askOpenEnded(code);
        } else {
          try {
            let start, end;
            if (somethingIsHighlighted) {
              start = selection.startLineNumber - 1;
              end = selection.endLineNumber;
            } else {
              start = 0;
              end = code.split('\n').length;
            }

            code = code.split('\n').slice(start, end).join('\n');
          } catch (o_0) {
            // console.log(o_0);
          }

          askMultipleChoice(code);
        }

        event.preventDefault();
      });

      shadow.getElementById('guide').addEventListener('click', (event) => {
        askMeGuide();
        event.preventDefault();
      });

      // --- open-ended configuration ---

      shadow
        .getElementById('ask-open-ended-config')
        .addEventListener('change', (event) => {
          const option = event.target.id;

          if (option.includes('level')) {
            const level = Number(option.split('-').pop());
            const indexOfLevel = ask.config.levels.indexOf(level);
            if (indexOfLevel === -1) {
              ask.config.levels.push(level);
            } else {
              ask.config.levels.splice(indexOfLevel, 1);
            }
          } else if (
            ask.config[option] &&
            typeof ask.config[option].ask === 'boolean'
          ) {
            ask.config[option].ask = !ask.config[option].ask;
          }

          event.preventDefault();
        });

      // initialize options panel
      if (ask.config.traces === undefined && ask.config.variables) {
        ask.config.traces = { ask: true };
      }
      for (const key in ask.config) {
        if (key === 'levels') {
          for (const level of ask.config.levels) {
            shadow.getElementById('level-' + level).checked = true;
          }
        } else {
          const element = shadow.getElementById(key);
          if (element && ask.config[key].ask) {
            element.checked = true;
          }
        }
      }

      // --- multiple choice configuration ---

      // const multipleChoiceConfig = shadow.getElementById(
      //   'ask-multiple-choice-config',
      // );

      // multipleChoiceConfig.addEventListener('change', (event) => {
      //   const option = event.target.id;

      //   if (generate.config.types.includes(option)) {
      //     generate.config.types = generate.config.types.filter(
      //       (type) => type !== option,
      //     );
      //   } else {
      //     generate.config.types.push(option);
      //   }

      //   event.preventDefault();
      // });

      // // initialize options panel
      // const mcConfigOptions = Array.from(multipleChoiceConfig.children).filter(
      //   (child) => child.nodeName === 'INPUT',
      // );
      // for (const child of mcConfigOptions) {
      //   if (child.checked) {
      //     generate.config.types.push(child.id);
      //   }
      // }
    }
  }
  customElements.define('ask-me', TraceIt);
});
