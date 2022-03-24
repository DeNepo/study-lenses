import { getCommentedLenses } from './lib/get-commented-lenses.js';
import { fileOrSnippet } from './lib/file-or-snippet.js';
import { getLang } from './lib/get-lang.js';
import { getFormattedCode } from '../lib/get-formatted-code.js';

import { createStudyLens } from './lib/create-study-lens.js';

export const studyCode = (root = Element) => {
  /*
    {
      pre: <pre>,
      lenses: [], // if present in preceding comment
      type: 'file|snippet' (full slide or embedded in text)
      lang: ''
    }
  */
  const codeBlocks = Array.from(root.getElementsByTagName('pre')).map(
    (pre) => ({
      pre,
      source: getFormattedCode(pre),
      lenses: getCommentedLenses(pre),
      type: fileOrSnippet(pre),
      lang: getLang(pre),
    }),
  );

  // ---------------

  const onlyCode = codeBlocks.filter((block) => block.type === 'file');

  for (const codeBlock of onlyCode) {
    const { pre, lang, lenses, source } = codeBlock;

    const studyLens = createStudyLens({
      code: source,
      lang,
      lenses: lenses,
    });

    pre.parentElement.replaceChild(studyLens, pre);
  }

  // ---------------

  const codeWithOtherThings = codeBlocks.filter(
    (block) => block.type === 'snippet',
  );

  for (const codeBlock of codeWithOtherThings) {
    const { pre, lang, source } = codeBlock;

    const newPre = document.createElement('pre');
    newPre.className = `language-${lang} line-numbers`;

    const newCode = document.createElement('code');
    newPre.appendChild(newCode);
    newCode.innerHTML = source;

    pre.parentElement.replaceChild(newPre, pre);

    Prism.highlightAllUnder(newPre.parentElement);
  }

  // ---------------

  return codeBlocks;
};
