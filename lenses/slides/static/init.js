import { mermaidize } from './mermaidize/index.js';
import { studyCode } from './study-code/index.js';

const preLenses = Array.from(
  document.getElementsByClassName('study-lens'),
).filter((node) => node.nodeName === 'A');

const windowPath = `${window.location.origin}${window.location.pathname}`.split(
  '/',
);
const windowBase = windowPath.slice(0, windowPath.length - 1).join('/');

for (const preLens of preLenses) {
  const src = preLens.href.split('?').shift().replace(windowBase, '.');
  const lenses = new URL(preLens.href).search
    .replace('?', '')
    .split('&')
    .join(' ');

  const studyLens = document.createElement('study-lens');
  studyLens.setAttribute('src', src);
  studyLens.setAttribute('lenses', lenses);

  preLens.parentElement.replaceChild(studyLens, preLens);
}

setTimeout(() => {
  mermaidize(document);
  studyCode(document);

  Array.from(document.getElementsByTagName('study-lens')).forEach(
    (studyLens) => (studyLens.className = 'lens'),
  );
}, 200);
