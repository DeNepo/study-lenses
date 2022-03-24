import { getFormattedCode } from '../lib/get-formatted-code.js';

export const mermaidize = (root = Element) => {
  const mermaidCodes = Array.from(root.getElementsByClassName('mermaid'));
  const mermaidPres = mermaidCodes.map((code) => code.parentElement);
  for (const pre of mermaidPres) {
    const div = document.createElement('div');
    div.innerHTML = getFormattedCode(pre);
    div.className = 'mermaid';
    pre.parentElement.replaceChild(div, pre);

    mermaid.init(undefined, div);
  }
};
