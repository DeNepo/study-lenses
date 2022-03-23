'use strict';

/*
  piping lenses does not work with this paradigm
*/

// import { CodeFE } from "../code/code-class.js";
import { JavaScriptFE } from '../javascript/javascript-class.js';

// class MarkdownFE extends CodeFE {
class MarkdownFE extends JavaScriptFE {
  constructor(config) {
    super(config, false);
    this.initMdUi();
  }

  initMdUi() {
    const pres = Array.from(document.getElementsByTagName('PRE'));

    if (this.config.inlines.literate) {
      const litPres = pres.filter(
        (pre) => !Array.from(pre.classList).includes('language-'),
      );

      let previousLine = 3;
      for (const pre of litPres) {
        pre.dataset.start = previousLine;
        previousLine = previousLine + pre.innerText.split('\n').length + 2;
      }
    }

    for (const pre of pres) {
      let lenseQueries = [];
      let currentSibling = pre;
      while (true) {
        const previousSibling =
          currentSibling && currentSibling.previousSibling;
        if (previousSibling && previousSibling.nodeType === 8) {
          const queryRegex = /(?:\?)(?<query>([a-z0-9\-&=])*)/gim;
          for (const match of previousSibling.textContent.matchAll(
            queryRegex,
          )) {
            if (match.groups.query && match.groups.query.includes('&')) {
              match.groups.query
                .split('&')
                .forEach((query) => lenseQueries.push(query));
            } else {
              lenseQueries.push(match.groups.query);
            }
          }

          const lensesRegex = /(?:lenses\:)(lenses:<query>([a-z0-9\-&=])*)/gim;
          for (const match of previousSibling.textContent.matchAll(
            lensesRegex,
          )) {
            if (match.groups.query && match.groups.query.includes(' ')) {
              match.groups.query
                .split(' ')
                .forEach((query) => lenseQueries.push(query));
            } else {
              lenseQueries.push(match.groups.query);
            }
          }
          break;
        } else if (previousSibling instanceof Element) {
          break;
        }

        if (!currentSibling && !previousSibling) {
          break;
        } else {
          currentSibling = previousSibling;
        }
      }

      if (lenseQueries.length === 0) {
        Prism.highlightAllUnder(pre);
      } else {
        const codeClassList = Array.from(pre.firstElementChild.classList);
        const languageClass = Array.from(codeClassList).find((className) =>
          /language/i.test(className),
        );
        const language = languageClass
          ? languageClass.replace('language-', '')
          : '.txt';
        const extMap = {
          javascript: 'js',
          markdown: 'md',
          bash: 'sh',
        };
        const ext = '.' + (extMap[language] ? extMap[language] : language);

        const code = pre.textContent;

        const pseudoResource = {
          resource: { content: code, info: { ext, base: 'resource' + ext } },
        };

        const stringifiedResource = encodeURIComponent(
          JSON.stringify(pseudoResource),
        );

        let query = '--debug&--resource=' + stringifiedResource;

        const stringifiedLocalConfig = encodeURIComponent(
          JSON.stringify(this.config.locals),
        );
        for (const lenseQuery of lenseQueries) {
          if (lenseQueries.includes('=')) {
            query += lenseQuery + '&';
            continue;
          }

          query += '&' + lenseQuery + '=' + stringifiedLocalConfig;
        }
        const url = window.location.origin + '?' + query;
        const lensedCode = document.createElement('iframe');
        lensedCode.src = url;
        lensedCode.width = '95%';
        // smarter ways to do height that didn't quite work
        //  code length
        //  .contentDocument.scrollHeight
        // parsonsEl.setAttribute("scrolling", "no");
        lensedCode.style = 'resize: both; overflow: auto;';
        pre.parentElement.replaceChild(lensedCode, pre);
      }
    }
  }
}

// Object.assign(MarkdownFE.prototype, JavaScriptFE.prototype);

export { MarkdownFE };
