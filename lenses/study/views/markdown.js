'use strict'

const marked = require('marked');
marked.setOptions({
  langPrefix: 'line-numbers language-'
})

const CodeSSR = require('./code.js')

class MarkdownSSR extends CodeSSR {

  constructor({ config, resource }) {
    super({ config, resource })
  }

  styles() {
    const superStyles = super.styles()
    return superStyles + `
      <link rel="stylesheet" href="${this.config.sharedStatic}/gh-styles.css">
      <link rel="stylesheet" href="${this.config.sharedStatic}/prism/style.css">`;
  }

  scriptsHead() {
    const superScriptsHead = super.scriptsHead()
    return superScriptsHead + `
      <script src='${this.config.sharedStatic}/prettier/standalone.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-babel.js'></script>
      <script src='${this.config.sharedStatic}/wc-code-along.js'></script>`
  }

  configOptions() {
    return ''
  }

  panel() {
    return ''
  }

  code() {
    return `<hr><hr>
    <main class="markdown-body">${marked(this.resource.content)}</main>`
  }

  scriptsBody() {
    let superScriptsBody = super.scriptsBody()
    superScriptsBody += `<script src='${this.config.sharedStatic}/lib/strip-comments.js'></script>
    <script src='${this.config.ownStatic}/types/javascript/static/aran-build.js'></script>

    <script src="${this.config.sharedStatic}/prism/script.js"></script>
    <script src="${this.config.sharedStatic}/prism/toolbar.js"></script>`

    const base = this.resource.info.base.toLowerCase();
    if (base.includes('.test.') || base.includes('.spec.')) {
      superScriptsBody += `<script src='${this.config.ownStatic}/dependencies/describe-it.js'></script>
      <script>
        define('chai',
          ["${this.config.ownStatic}/dependencies/chai-and-chai-dom.js"],
          function (require, exports, beta) {
            return require;
          }
        );
      </script>`
    }

    return superScriptsBody
  }

}

module.exports = MarkdownSSR

