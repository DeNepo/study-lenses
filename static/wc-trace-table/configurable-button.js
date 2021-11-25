import { TraceTable } from "./index.js";

// window.TraceTable = TraceTable;

export class TraceTableButton extends HTMLElement {
  constructor() {
    super();

    let which = "steps";
    try {
      which = config.locals.table;
    } catch (_) {}

    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <button id='table-button'>table</button>
      <select id="type">
        <option value="steps" ${
          which === "steps" || this.hasAttribute("steps") ? "selected" : ""
        }>variable steps</option>
        <option value="values" ${
          which === "values" || this.hasAttribute("values") ? "selected" : ""
        }>variable values</option>
        <option value="operators" ${
          which === "operators" || this.hasAttribute("operators")
            ? "selected"
            : ""
        }>operators</option>
      </select>`;

    shadow.getElementById("table-button").addEventListener("click", () => {
      const tableType = shadow.getElementById("type").value;
      const traceTable = new TraceTable(tableType);
      document.body.appendChild(traceTable);
    });
  }
}

// could eventually have the table type configured by an attribute
//  <trace-table-button steps></trace-table-button>
customElements.define("trace-table-button", TraceTableButton);
