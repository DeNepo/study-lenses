
export class CodeFE {

  config = {}
  editor = null

  constructor(config) {
    this.config = config
    this.initUi()
    this.initEditor()
  }

  initUi() {

    // // default to editable, don't expose option for read-only
    // document.getElementById('read-only-input')
    //   .addEventListener('click', () => {
    //     this.readOnly = !this.readOnly
    //     this.editor.updateOptions({ readOnly: this.readOnly })
    //   })

    document.getElementById('format-button')
      .addEventListener('click', () =>
        this.editor.trigger('anyString', 'editor.action.formatDocument'))

    document.getElementById('reset-button')
      .addEventListener('click', () => this.editor.setValue(this.config.content || ''))

    document.getElementById('save-button')
      .addEventListener('click', () => {
        fetch(window.location.origin + window.location.pathname + '?study&--debug', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: this.editor.getValue() }),
        })
          .then(response => response.text())
          .then(message => {
            alert(message);
            console.log(message);
          })
          .catch((err) => {
            alert(err.name + ': ' + err.message);
            console.error('Error:', err);
          })
      })


    document.getElementById('parsonize-selection-button')
      .addEventListener('click',
        () => this.openSelectionWith('parsons'))

    const diffSelectionButton = document.getElementById('diff-selection-button')
    diffSelectionButton.addEventListener('click',
      () => this.openSelectionWith('diff-scramble'))


    document.getElementById('diff-selection-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          diffSelectionButton.style = 'display: inline-block;'
        } else {
          diffSelectionButton.style = 'display: none;'
        }
      })

  }

  initEditor() {

    const container = document.getElementById('editor-container')

    container.style.overflow = 'hidden';

    // const readOnly = typeof this.config.readOnly === 'boolean'
    //   ? this.config.readOnly : false
    const readOnly = false

    const options = Object.assign(
      {
        language: monacoExtToLanguage[config.ext] || '',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        theme: "vs-dark",
        wrappingIndent: "indent",
        wordWrap: 'wordWrapColumn',
        wordWrapColumn: 100,
        automaticLayout: true,
        readOnly,
        tabSize: 2,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingStrategy: 'advanced',
        minimap: {
          enabled: true
        },
        overviewRulerLanes: 0
      },
      config
    );

    this.editor = monaco.editor.create(container, options);
    this.editor.setValue(this.config.content || '');
    this.editor.layout();

    // https://github.com/microsoft/monaco-editor/issues/794#issuecomment-688959283
    this.editor.onDidChangeModelDecorations(() => {
      updateEditorHeight() // typing
      requestAnimationFrame(updateEditorHeight) // folding
    })

    const lineHeight = this.editor.getOption(monaco.editor.EditorOption.lineHeight)
    const lineCount = this.editor.getModel()?.getLineCount() || 1
    let prevHeight = this.editor.getTopForLineNumber(lineCount + 1) + lineHeight


    const updateEditorHeight = () => {
      const editorElement = this.editor.getDomNode()

      if (!editorElement) {
        return
      }

      const lineHeight = this.editor.getOption(monaco.editor.EditorOption.lineHeight)
      const lineCount = this.editor.getModel()?.getLineCount() || 1
      const height = this.editor.getTopForLineNumber(lineCount + 1) + lineHeight

      if (prevHeight !== height) {
        prevHeight = height
        editorElement.style.height = `${height + 10}px`
        this.editor.layout()
      }
    }
    updateEditorHeight();

  }

  getSelection(monacoThing) {
    const editorSelection = this.editor.getSelection();
    const editorSelectionEntries = Object.entries(editorSelection);
    const columnEntries = [];
    const lineEntries = [];
    for (const entry of editorSelectionEntries) {
      if (entry[0].includes('Column')) {
        columnEntries.push(entry);
      } else {
        lineEntries.push(entry);
      }
    }
    const firstLine = lineEntries[0][1];
    const firstColum = columnEntries[0][1];
    const noSelection = columnEntries.every((entry) => entry[1] === firstColum)
      && lineEntries.every((entry) => entry[1] === firstLine);


    if (noSelection) {
      return '';
    }

    let selection = '';
    const start = editorSelection.startLineNumber;
    const end = editorSelection.endLineNumber;
    const getFromThis = typeof this.editor.getModel === 'function'
      ? this.editor.getModel()
      : this.editor;
    for (let i = start; i <= end; i++) {
      selection += getFromThis.getLineContent(i) + '\n';
    }

    return selection;
  }

  openSelectionWith(queryKey) {
    const code = this.getSelection()
    if (!code) {
      alert('no code selected');
      return;
    }

    const baseConfig = {
      code,
      ext: this.config.ext
    }
    const finalConfig = Object.assign(baseConfig, this.config.locals)
    const queryValue = encodeURIComponent(JSON.stringify(finalConfig))
    const query = `?${queryKey}=${queryValue}`
    const url = window.location.origin + query

    window.open(url, '_blank')

  }


}
