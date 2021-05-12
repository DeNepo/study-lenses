import { TraceTable } from "./index.js";

// window.TraceTable = TraceTable;

export class TraceTableButton extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <button id='table-button'>table</button>
      <select id="type">
        <option value="steps">steps</option>
        <option value="values">values</option>
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
