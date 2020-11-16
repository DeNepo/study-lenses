'use strict';

/* proof of concept only
  changes are lost when switching between pages unless explicitly saved
*/

const marked = require('marked');
const renderer = new marked.Renderer();

marked.setOptions({
  baseUrl: 'toad'
})

const target = 'currentStudy';


const gitbookfiy = (summaryText, readmeExists) => {

  renderer.link = function (href, title, text) {
    // return `<a target="${target}" href="${href}" ${title ? `title="${title}"` : ''}>${text}</a>`;
    const isRe = href.toLowerCase().includes('.re.')
    return `<button onclick='document.getElementById("i-frame").src = window.location.origin + window.location.pathname + "/${href}?${isRe ? 'min&' : ''}--defaults"' ${title ? `title="${title}"` : ''}>${text}</button>`;
  }
  return `
      <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="shared_static_resources/gh-styles.css">
          <link rel="stylesheet" href="shared_static_resources/prism/style.css">
          <style>
            .gitbook {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              height: 98vh;
            }
          </style>
        </head>
        <body>
          <div class="gitbook">
            <main class="markdown-body">${marked(summaryText, { renderer: renderer, baseUrl: 'toad' })}</main>
            <iframe id='i-frame' style='height: 100%; width: 100%; margin-left: 1%;' name="${target}"></iframe>
          <div>
          <script src="shared_static_resources/prism/script.js"></script>

          <script>
            if (${readmeExists}) {
              document.getElementById("i-frame").src = window.location.origin + window.location.pathname + '/README.md?--defaults';
            }
          </script>
        </body>
      </html>`
};

module.exports = gitbookfiy;
