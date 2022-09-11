export class CodeFE {
  config = {};
  editor = null;
  theme = 'vs-dark';

  constructor(config, editor = true) {
    this.config = config;
    try {
      this.initUi();
    } catch (err) {
      // console.error(err);
    }
    if (editor) {
      this.initEditor();
    }
    this.config.locals.parsons = true;
  }

  initUi() {
    // // default to editable, don't expose option for read-only
    // document.getElementById('read-only-input')
    //   .addEventListener('click', () => {
    //     this.readOnly = !this.readOnly
    //     this.editor.updateOptions({ readOnly: this.readOnly })
    //   })

    const theme = document.getElementById('dark-checkbox');

    if (this.config.locals.dark === false) {
      theme.checked = false;
      this.theme = 'vs-light';
    }

    theme.addEventListener('click', (event) => {
      if (event.target.checked) {
        this.editor.updateOptions({ theme: 'vs-dark' });
        this.theme = 'vs-dark';
      } else {
        this.editor.updateOptions({ theme: 'vs-light' });
        this.theme = 'vs-light';
      }
    });

    const minimap = document.getElementById('minimap-checkbox');
    minimap.addEventListener('click', (event) => {
      if (event.target.checked) {
        this.editor.updateOptions({ minimap: { enabled: true } });
      } else {
        this.editor.updateOptions({ minimap: { enabled: false } });
      }
    });

    document
      .getElementById('format-button')
      .addEventListener('click', () =>
        this.editor.trigger('anyString', 'editor.action.formatDocument'),
      );

    document
      .getElementById('reset-button')
      .addEventListener('click', () =>
        this.editor.setValue(this.config.content || ''),
      );

    document
      .getElementById('print-selection-button')
      .addEventListener('click', () => this.openSelectionWith('print'));

    if (this.config.locals.save === true) {
      const getFileName = () => {
        const proceed = confirm(
          'would you like to save this as a new file?\n- "ok" to create a new file\n- "cancel" to save to the same file',
        );
        if (proceed) {
          let fileName = '';
          while (!fileName) {
            fileName = prompt('enter the new file name:');
          }
          return fileName;
        } else {
          return '';
        }
      };

      window.save = () => {
        fetch(`${window.location.origin}${window.location.pathname}?study`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: this.editor.getValue(),
            fileName: this.config.locals.newFile ? getFileName() : '',
          }),
        })
          .then((response) => response.text())
          .then((message) => {
            alert(message);
            console.log(message);
          })
          .catch((err) => {
            alert(err.name + ': ' + err.message);
            console.error('Error:', err);
          });
      };

      document
        .getElementById('save-button')
        .addEventListener('click', window.save);
    }

    document
      .getElementById('permalink-button')
      .addEventListener('click', () => {
        const permalinkParamObject = {
          permalink: {
            content: this.editor.getValue(),
            ext: this.config.ext,
            locals: this.config.locals,
            queryValue: this.config.queryValue,
            base: this.config.base || '',
          },
        };

        const permalinkParamEncoded = encodeURIComponent(
          JSON.stringify(permalinkParamObject),
        );

        const permalink =
          window.location.origin + '?study=' + permalinkParamEncoded;

        if (!navigator.clipboard) {
          fallbackCopyTextToClipboard(permalink);
          return;
        }
        navigator.clipboard.writeText(permalink).then(
          function () {
            // console.log('Async: Copying to clipboard was successful!');
          },
          function (err) {
            // console.error('Async: Could not copy text: ', err);
            fallbackCopyTextToClipboard(permalink);
          },
        );

        function fallbackCopyTextToClipboard(text) {
          var textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            // console.log('Fallback: Copying text command was ' + msg);
          } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
          }

          document.body.removeChild(textArea);
          window.scrollTo(0, 0);
        }

        alert('copied permalink');
      });

    document
      .getElementById('parsonize-selection-button')
      .addEventListener('click', () => this.openSelectionWith('parsons'));

    document
      .getElementById('highlight-selection-button')
      .addEventListener('click', () => this.openSelectionWith('highlight'));

    const diffSelectionButton = document.getElementById(
      'diff-selection-button',
    );
    diffSelectionButton.addEventListener('click', () =>
      this.openSelectionWith('diff'),
    );
    document
      .getElementById('diff-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          diffSelectionButton.style = 'display: inline-block;';
        } else {
          diffSelectionButton.style = 'display: none;';
        }
      });

    document
      .getElementById('diff-selection-input')
      .addEventListener('change', (event) => {
        this.config.locals.diff = !this.config.locals.diff;
        if (event.target.checked) {
          diffSelectionButton.style = 'display: inline-block;';
        } else {
          diffSelectionButton.style = 'display: none;';
        }
      });
  }

  initEditor() {
    const container = document.getElementById('editor-container');

    if (container === null) {
      return;
    }

    container.style.overflow = 'hidden';

    // const readOnly = typeof this.config.readOnly === 'boolean'
    //   ? this.config.readOnly : false
    const readOnly = false;

    const options = Object.assign(
      {
        language: monacoExtToLanguage[config.ext] || '',
        roundedSelection: true,
        scrollBeyondLastLine: true,
        theme: this.theme,
        wrappingIndent: 'indent',
        wordWrap: 'wordWrapColumn',
        wordWrapColumn: 100,
        automaticLayout: true,
        readOnly,
        tabSize: 2,
        wordWrap: 'on',
        wrappingStrategy: 'advanced',
        minimap: {
          enabled: false,
        },
        overviewRulerLanes: 0,
        // fontSize: 13,
      },
      config,
    );

    this.editor = monaco.editor.create(container, options);
    this.editor.setValue(this.config.content || '');
    this.editor.layout();

    // https://github.com/microsoft/monaco-editor/issues/794#issuecomment-688959283
    this.editor.onDidChangeModelDecorations(() => {
      updateEditorHeight(); // typing
      requestAnimationFrame(updateEditorHeight); // folding
    });

    const lineHeight = this.editor.getOption(
      monaco.editor.EditorOption.lineHeight,
    );
    const lineCount = this.editor.getModel()?.getLineCount() || 1;
    let prevHeight =
      this.editor.getTopForLineNumber(lineCount + 1) + lineHeight;

    const updateEditorHeight = () => {
      const editorElement = this.editor.getDomNode();

      if (!editorElement) {
        return;
      }

      const lineHeight = this.editor.getOption(
        monaco.editor.EditorOption.lineHeight,
      );
      const lineCount = this.editor.getModel()?.getLineCount() || 1;
      const height =
        this.editor.getTopForLineNumber(lineCount + 1) + lineHeight;

      if (prevHeight !== height) {
        prevHeight = height;
        editorElement.style.height = `${height + 10}px`;
        this.editor.layout();
      }
    };
    updateEditorHeight();
  }

  getSelection() {
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
    const noSelection =
      columnEntries.every((entry) => entry[1] === firstColum) &&
      lineEntries.every((entry) => entry[1] === firstLine);

    if (noSelection) {
      return this.editor.getValue();
    }

    let selection = '';
    const start = editorSelection.startLineNumber;
    const end = editorSelection.endLineNumber;
    const getFromThis =
      typeof this.editor.getModel === 'function'
        ? this.editor.getModel()
        : this.editor;
    for (let i = start; i <= end; i++) {
      selection += getFromThis.getLineContent(i) + '\n';
    }

    return selection;
  }

  openWith(queryKey, code = '', cb) {
    const pseudoResource = {
      resource: {
        content: code,
        info: {
          ext: this.config.ext,
          type: 'file',
        },
      },
    };
    // console.log(pseudoResource);

    const stringifiedResource = encodeURIComponent(
      JSON.stringify(pseudoResource),
    );

    const baseConfig = {
      code,
    };
    // const queryValue = encodeURIComponent(JSON.stringify(baseConfig));
    const finalConfig = Object.assign(baseConfig, this.config);
    const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
    // if the full file is used, open lense with local configs from exercise
    //  otherwise don't, because anything syntax/runtime based will probably break for selections
    const url =
      window.location.origin +
      window.location.pathname +
      (queryValue
        ? `?${queryKey}&--resource=${stringifiedResource}`
        : `?${queryKey}=${queryValue}&--resource=${stringifiedResource}`);
    if (typeof cb === 'function') {
      cb(url);
    } else {
      window.open(url, '_blank');
    }
  }

  openSelectionWith(queryKey, code = '', cb) {
    const selectedCode = code || getMonacoSelection(this.editor);
    code = code || selectedCode || this.editor.getValue();

    this.openWith(queryKey, code, cb);
  }
}
