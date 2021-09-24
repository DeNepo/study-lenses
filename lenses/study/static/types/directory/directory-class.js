import { MarkdownFE } from "../markdown/markdown-class.js";

export class DirectoryFE extends MarkdownFE {
  constructor(config) {
    super(config);
    this.initDirectoryUI();
  }

  initDirectoryUI() {
    const search = (event) => {
      const searchConfig = {
        searchQuery: event.target.form.search.value,
        flags:
          (event.target.form.g.checked ? "g" : "") +
          (event.target.form.i.checked ? "i" : "") +
          (event.target.form.m.checked ? "m" : ""),
      };
      console.log(searchConfig);

      const searchURL =
        window.location.origin +
        window.location.pathname +
        "?study=" +
        encodeURIComponent(JSON.stringify(searchConfig));

      window.open(searchURL, "_self");
    };

    document.getElementById("search-button").addEventListener("click", search);
    document
      .getElementById("search-input")
      .addEventListener("keyup", (event) => {
        event.preventDefault();
        if (event.key === "Enter") {
          search(event);
        }
        return false;
      });
  }
}
