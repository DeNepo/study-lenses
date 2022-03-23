'use strict';

/* proof of concept only
  changes are lost when switching between pages unless explicitly saved
  if a summary links to just a folder
    render all the folder's contents as a details
    so you can say /isolate and let it be dynamic to changes
*/

const marked = require('marked');
const renderer = new marked.Renderer();

marked.setOptions({
  baseUrl: 'toad',
});

const target = 'currentStudy';

const gitbookfiy = (summaryText, readmeExists, config) => {
  renderer.link = function (href, title, text) {
    // return `<a target="${target}" href="${href}" ${title ? `title="${title}"` : ''}>${text}</a>`;
    const isRe = href.toLowerCase().includes('.re.');
    return `<a onclick='document.getElementById("i-frame").src = window.location.origin + window.location.pathname + "/${href}?${
      isRe ? 'min&' : ''
    }--defaults"' ${title ? `title="${title}"` : ''}>${text}</a>`;
  };

  return `
      <!DOCTYPE html>
        <html>
        <head>
          <link href="${config.ownStatic}/styles.css" rel="stylesheet" />
        </head>
        <body>
          <div class="gitbook">
            <main class="sidenav">${marked(summaryText, {
              renderer: renderer,
              // baseUrl: "toad",
            })}</main>
            <iframe id='i-frame' class="main" name="${target}"></iframe>
          <div>

          <script>
            if (${readmeExists}) {
              document.getElementById("i-frame").src = window.location.origin + window.location.pathname + '/README.md?--defaults';
            }
          </script>
        </body>
      </html>`;
};

module.exports = gitbookfiy;
