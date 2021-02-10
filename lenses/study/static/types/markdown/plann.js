const extensionMap = require("../extension-language-map.json");

// normalize code-fence names
for (const key in extensionMap) {
  code = code.replace(
    new RegExp("```" + key + "(\\b)", "gim"),
    "```" + extensionMap[key] + "$1"
  );
}

const hasMermaid = code.includes("```mermaid");
if (hasMermaid) {
  code = code.replace(
    /```mermaid([\s\S]*?)```/gm,
    (_, mermaidGraph) => `<div class="mermaid">${mermaidGraph}</div>`
  );
}

const renderedCode = marked(code);

// only html/css/js become live-studied
//  all else fall back to prism
