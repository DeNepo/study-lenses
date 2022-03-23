import { getCommentedLenses } from './lib/get-commented-lenses.js';
import { fileOrSnippet } from './lib/file-or-snippet.js';
import { getLang } from './lib/get-lang.js';

import { createStudyLens } from './lib/create-study-lens.js';

/*
  {
    pre: <pre>,
    lenses: [], // if present in preceding comment
    type: 'file|snippet' (full slide or embedded in text)
    lang: ''
  }
*/
const codeBlocks = Array.from(document.getElementsByTagName('pre')).map(
  (pre) => ({
    pre,
    lenses: getCommentedLenses(pre),
    type: fileOrSnippet(pre),
    lang: getLang(pre),
  }),
);

// ---------------

const onlyCode = codeBlocks.filter((block) => block.type === 'file');

for (const codeBlock of onlyCode) {
  const { pre, lang, lenses } = codeBlock;

  const studyLens = createStudyLens({
    code: pre.innerText,
    lang: lang,
    lenses: lenses,
  });

  pre.parentElement.replaceChild(studyLens, pre);
}

// ---------------

const codeWithOtherThings = codeBlocks.filter(
  (block) => block.type === 'snippet',
);

for (const codeBlock of codeWithOtherThings) {
  const { pre } = codeBlock;

  pre.classList = pre.children[0].classList;
  pre.classList.remove('hljs');
  pre.classList.remove('remark-code');

  Array.from(pre.classList).forEach((className) => {
    pre.classList.remove(className);
    pre.classList.add(`language-${className}`);
  });
  pre.classList.add('line-numbers');

  const newCode = document.createElement('code');
  newCode.innerHTML = pre.innerText;

  const oldCode = pre.children[0];

  pre.removeChild(oldCode);
  pre.appendChild(newCode);
}

// ---------------

Array.from(document.getElementsByTagName('study-lens')).forEach(
  (studyLens) => (studyLens.className = 'lens'),
);
