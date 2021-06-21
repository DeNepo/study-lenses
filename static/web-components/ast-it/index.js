import { CodeConsumer } from "../base/class-code-consumer.js";

export class ASTIt extends CodeConsumer {
  config = {
    type: "text/javascript",
  };

  constructor() {
    super();
  }

  connectedCallback() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `<form>
        <input value='syntax tree' type='button'/>
        <select name='format'>
          <option>estree</option>
          <option>shift</option>
        </select>
      </form>`;

    formContainer.addEventListener("click", (event) => {
      if (event.target.type !== "button") {
        return;
      }

      if (event.target.form.format.value === "estree") {
        const comments = [];

        let ast;
        try {
          const parseConfig = {
            locations: true,
            onComment: comments,
          };
          if (this.config.type === "module") {
            parseConfig.sourceType = "module";
          }
          ast = Acorn.parse(editor.getValue(), parseConfig);
        } catch (err) {
          eval(editor.getValue());
        }
        astravel.attachComments(ast, comments);
        console.log(ast);
      } else {
        let ast;
        try {
          ast = parser.parseScriptWithLocation(editor.getValue());
        } catch (err) {
          eval(editor.getValue());
        }
        console.log(ast);
      }
    });

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(formContainer);
  }
}

customElements.define("ast-it", ASTIt);
