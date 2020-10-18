import { CodeFE } from '../code/code-class.js'

export class HtmlFE extends CodeFE {

  constructor(config) {
    super(config)
    this.outputContainer = document.getElementById('output-container')
    this.initHtmlUi()
    this.editor.updateOptions({ readOnly: false })
    this.editor.onDidChangeModelContent(debounce(this.renderIFrame.bind(this), 500))
    this.renderIFrame()
  }

  initHtmlUi() {

    document.getElementById('new-tab-button')
      .addEventListener('click', () => {
        const x = window.open()
        x.document.open()
        x.document.write(this.editor.getValue())
        x.document.close()
      })

  }


  renderIFrame() {
    const iframe = document.createElement('iframe')
    iframe.style = 'height: 100%; width: 100%;'
    iframe.onload = () => {
      iframe.contentDocument.open()
      iframe.contentDocument.write(this.editor.getValue())
      iframe.contentDocument.close()
    }

    this.outputContainer.innerHTML = ''
    this.outputContainer.appendChild(iframe)
  }

}
