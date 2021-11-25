import { CodeConsumer } from "../base/class-code-consumer.js";

export class OpenIn extends CodeConsumer {
  config = {
    sites: {
      jsTutorLive: function (code) {
        const encodedJST = encodeURIComponent(code);
        const sanitizedJST = encodedJST
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%09/g, "%20%20");

        const jsTutorURL =
          "http://www.pythontutor.com/live.html#code=" +
          sanitizedJST +
          "&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";

        window.open(jsTutorURL, "_blank");
      },
      jsTutor: function (code) {
        const encodedJST = encodeURIComponent(code);
        const sanitizedJST = encodedJST
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%09/g, "%20%20");
        const jsTutorURL =
          "http://www.pythontutor.com/visualize.html#code=" +
          sanitizedJST +
          "&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";
        window.open(jsTutorURL, "_blank");
      },
      loupe: function (code) {
        const encoded = encodeURIComponent(btoa(code));
        const loupeURL = "http://latentflip.com/loupe/?code=" + encoded + "!!!";
        window.open(loupeURL, "_blank");
      },
      promisees: function (code) {
        const encoded = encodeURIComponent(code).replace(/%20/g, "+");
        const URL = "https://bevacqua.github.io/promisees/#code=" + encoded;
        window.open(URL, "_blank");
      },
    },
  };

  constructor() {
    super();
  }

  connectedCallback() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `<form>
        <input value='open in' type='button'/>
        <select name='site'>
          ${Object.keys(this.config.sites).map(
            (viztool) => `<option>${viztool}</option>`
          )}
        </select>
      </form>`;

    formContainer.addEventListener("click", (event) => {
      if (event.target.type !== "button") {
        return;
      }

      this.config.sites[event.target.form.site.value](this.code);
    });

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(formContainer);
  }
}

customElements.define("open-in", OpenIn);
