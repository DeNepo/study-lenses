import { CodeConsumer } from "../base/class-code-consumer.js";

export class LensIt extends CodeConsumer {
  config = {
    ext: ".js",
    queryKeys: [],
  };

  constructor() {
    super();

    if (this.hasAttribute("ext")) {
      this.config.ext = this.getAttribute("ext");
    }

    if (this.hasAttribute("buttons") && this.getAttribute("buttons")) {
      this.config.queryKeys = this.getAttribute("buttons")
        .split(",")
        .map((key) => key.trim());

      this.config.queryKeys = this.config.queryKeys.filter((key) => key !== "");
    }

    if (this.config.queryKeys.length === 0) {
      this.style = "display: none;";
    }
  }

  openWith(queryKey, code = this.code) {
    const pseudoResource = {
      resource: {
        content: code,
        info: { ext: this.config.ext },
      },
    };

    const stringifiedResource = encodeURIComponent(
      JSON.stringify(pseudoResource)
    );

    const baseConfig = {
      code,
      ext: this.config.ext,
    };
    const finalConfig = Object.assign(baseConfig, this.config);
    const queryValue = encodeURIComponent(JSON.stringify(finalConfig));

    const url =
      window.location.origin +
      window.location.pathname +
      (queryValue
        ? `?${queryKey}&--resource=${stringifiedResource}`
        : `?${queryKey}=${queryValue}&--resource=${stringifiedResource}`);

    window.open(url, "_blank");
  }

  connectedCallback() {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.innerHTML = this.config.queryKeys
      .map((queryKey) => `<button>${queryKey}</button>`)
      .join("");

    buttonsContainer.addEventListener("click", (event) => {
      if (event.target.nodeName !== "BUTTON") {
        return;
      }

      this.openWith(event.target.innerText);
    });

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(buttonsContainer);
  }
}

customElements.define("lens-it", LensIt);
