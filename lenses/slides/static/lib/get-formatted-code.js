export const getFormattedCode = (pre = HTMLPreElement) =>
  Array.from(pre.getElementsByTagName('div'))
    .map((el) => el.innerText)
    .join('\n');
