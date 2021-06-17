/*
  other ways to get code
  - src attribute via fetch

  these are generally endpoints, async can be dealt with simply
*/

export class CodeConsumer extends HTMLElement {
  // class CodeConsumer extends HTMLElement {
  _code = "";

  constructor(code = "") {
    super();

    if (typeof code === "string") {
      this._code = code;
    }

    this.setAttribute("code-consumer", "");
  }

  connectedCallback() {
    if (this.hasAttribute("code")) {
      this._code = decodeURI(this.getAttribute("code"));
    }
    // setTimeout(() => {
    //   if (this.innerText !== "") {
    //     this._code = this.innerText;
    //     this.innerHTML = "";
    //   }
    // }, 0);
  }

  get code() {
    let code;
    if (typeof this._code === "string") {
      code = this._code;
    } else if (typeof this._code === "function") {
      try {
        code = this._code();
      } catch (err) {
        // code = `/*\n\n  an error occurred getting your code:\n  ${err.toString()}\n\n*/`;
      }
    }
    return code;
  }

  set code(val) {
    if (typeof val === "string" || typeof val === "function") {
      this._code = val;
    } else {
      throw new TypeError("new code is not a string or a function");
    }
  }
}

customElements.define("code-consumer", CodeConsumer);
