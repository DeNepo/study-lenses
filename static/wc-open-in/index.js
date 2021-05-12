import { studyWith } from "./study-with.js";

class OpenIn extends HTMLElement {
  constructor(openIn) {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const openable = [
      "jsTutorLive",
      "jsTutor",
      "promisees",
      "loupe",
      "esprima",
    ];
    shadow.innerHTML = `
      <form id='open-in-container'>
        <input id='open-in-button' value='open in' type='button'/>
        <select name='thisThing'>
          ${openable.map((viztool) => {
            return `<option ${
              viztool === openIn ? "selected" : ""
            }>${viztool}</option>`;
          })}
        </select>
      </form>`;

    shadow
      .getElementById("open-in-button")
      .addEventListener("click", (event) => {
        const thisThing = event.target.form.thisThing.value;
        // hard-coded to make it work for now
        studyWith[thisThing](editor.getValue());
        event.preventDefault();
      });
  }
}

// could eventually have the table type configured by an attribute
//  <trace-table hyf></trace-table>
customElements.define("open-in", OpenIn);
