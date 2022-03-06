export const renderObject = (title = "", object = {}) => `
  <details>
    <summary><h2 style="display: inline">${title}</h2></summary>
    <table>
      ${Object.entries(object)
        .map((entry) => `<tr><td>${entry[0]}</td><td>${entry[1]}</td></tr>`)
        .join("\n")}
    </table>
  </details>`;
