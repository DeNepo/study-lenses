import { CodeConsumer } from "../base/class-code-consumer.js";

export class ASTIt extends CodeConsumer {
  config = {
    type: "text/javascript",
  };
  views = {
    astexplorerSite: (code) => {
      // https://stackoverflow.com/a/30810322
      // if (!navigator.clipboard) {
      var textArea = document.createElement("textarea");
      textArea.value = code;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);

        alert(
          "your code is copied, you can paste it in astexplorer after the site opens"
        );
        window.open("_blank").location.href = "https://astexplorer.net/";
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }

      document.body.removeChild(textArea);
    },
    estreeLog: (code) => {
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
        ast = Acorn.parse(code, parseConfig);
      } catch (err) {
        eval(code);
      }
      astravel.attachComments(ast, comments);
      console.log(ast);
    },
    shiftLog: (code) => {
      let ast;
      try {
        ast = parser.parseScriptWithLocation(code);
      } catch (err) {
        eval(code);
      }
      console.log(ast);
    },
    // not used
    shiftSite: (code) => {
      // https://shift-ast.org/
    },
    esprimaSite: (code) => {
      const encoded = encodeURIComponent(code);
      const URL = "https://esprima.org/demo/parse.html?code=" + encoded;
      window.open(URL, "_blank");
    },
  };

  constructor() {
    super();
  }

  connectedCallback() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `<form>
        <input value='syntax tree' type='button'/>
        <select name='format'>
          <option>astexplorer</option>
          <option>estree (log)</option>
          <option>shift (log)</option>
        </select>
      </form>`;

    formContainer.addEventListener("click", (event) => {
      if (event.target.type !== "button") {
        return;
      }

      const option = event.target.form.format.value;
      if (option === "estree (log)") {
        this.views.estreeLog(editor.getValue());
      } else if (option === "shift (log)") {
        this.views.shiftLog(editor.getValue());
      } else if (option === "astexplorer") {
        this.views.astexplorerSite(editor.getValue());
      }
    });

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(formContainer);
  }
}

customElements.define("ast-it", ASTIt);
