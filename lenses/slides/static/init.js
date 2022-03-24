import { mermaidize } from './mermaidize/index.js';
import { studyCode } from './study-code/index.js';

setTimeout(() => {
  mermaidize(document);
  studyCode(document);

  Array.from(document.getElementsByTagName('study-lens')).forEach(
    (studyLens) => (studyLens.className = 'lens'),
  );
}, 200);
