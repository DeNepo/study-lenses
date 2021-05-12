import * as steps from "./steps.js";
import * as values from "./values.js";

export class TraceTable extends HTMLElement {
  constructor(type) {
    super();

    const closableDiv = document.createElement("div");

    const shadow = this.attachShadow({ mode: "open" });

    if (type === "steps") {
      shadow.innerHTML += steps.style;
    } else {
      shadow.innerHTML += values.style;
    }
    shadow.appendChild(closableDiv);

    const tableContainer = document.createElement("div");
    closableDiv.appendChild(tableContainer);
    if (type === "steps") {
      tableContainer.innerHTML += steps.table;
      steps.init(shadow);
    } else {
      tableContainer.innerHTML += values.table;
      values.init(shadow);
    }
    const closeTable = () => this.parentElement.removeChild(this);
    shadow.getElementById("close-button").addEventListener("click", closeTable);

    // https://stackoverflow.com/a/26756919
    //  https://jsfiddle.net/chridam/has354o1/
    $(this)
      .draggable()
      .dblclick(() => {
        $(this).draggable({ disabled: false });
      })
      .click(() => {
        $(this).draggable({ disabled: true });
      });

    this.style = `
      position: fixed;
      top: 50%;
      left: 50%;
      z-index: 500;`;
  }
}

// could eventually have the table type configured by an attribute
//  <trace-table steps></trace-table>
customElements.define("trace-table", TraceTable);
