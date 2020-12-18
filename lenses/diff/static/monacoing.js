const anEditor = ({
  container = document.createElement('div'),
  config = {}
}) => {

  container.style.width = '95%';
  container.style.overflow = 'hidden';

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
      readOnly: true,
      tabSize: 2,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      wrappingStrategy: 'advanced',
      minimap: {
        enabled: false
      },
      overviewRulerLanes: 0
    },
    config
  );

  const editor = monaco.editor.create(container, options);
  editor.setValue(config.code);


  // https://github.com/microsoft/monaco-editor/issues/794#issuecomment-688959283
  editor.onDidChangeModelDecorations(() => {
    updateEditorHeight() // typing
    requestAnimationFrame(updateEditorHeight) // folding
  })

  const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
  const lineCount = editor.getModel()?.getLineCount() || 1
  let prevHeight = editor.getTopForLineNumber(lineCount + 1) + lineHeight


  const updateEditorHeight = () => {
    const editorElement = editor.getDomNode()

    if (!editorElement) {
      return
    }

    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
    const lineCount = editor.getModel()?.getLineCount() || 1
    const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight

    if (prevHeight !== height) {
      prevHeight = height
      editorElement.style.height = `${height + 10}px`
      editor.layout()
    }
  }
  updateEditorHeight();


  // const updateHeight = () => {
  //   const contentHeight = Math.min(1000, editor.getContentHeight());
  //   // container.style.width = `${width}px`;
  //   container.style.height = `${contentHeight}px`;
  //   try {
  //     editor.layout({ width: '100%', height: contentHeight });
  //   } catch (_) { }
  // };
  // editor.onDidContentSizeChange(updateHeight);
  // updateHeight();
  // editor.trigger('source', 'editor.action.didContentSizeChange');



  const toggleReadOnly = (event) => {
    const checked = event.target.checked;
    editor.updateOptions({ readOnly: checked })
  };

  const format = () => {
    editor.trigger('anyString', 'editor.action.formatDocument');
  };

  const reset = () => {
    editor.setValue(config.code);
  };

  const save = (monacoThing, path) => () => {
    const bodyData = {
      code: monacoThing.getValue()
    }

    fetch(window.location.origin + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then(response => {
        return response.text();
      })
      .then(message => {
        alert(message);
        console.log(message);
      })
      .catch((err) => {
        alert(err.name + ': ' + err.message);
        console.error('Error:', err);
      })
  };


  const modelMaker = ({ code = '', language = '', path = '' }) => {
    const model = editor.createModel(code, language);
    return {
      model,
      save: save(model, config.path)
    }
  };


  return {
    editor,
    container,
    modelMaker,
    handlers: {
      toggleReadOnly,
      format,
      reset,
      save: save(editor, config.path)
    }
  }

};

