const init = async (path) => {

  try {
    const res = await fetch(path);
    const text = await res.text();
    const editor = monaco.editor.create(
      document.getElementById('editor-container'),
      {
        language: 'plain',
        value: text,
        roundedSelection: true,
        scrollBeyondLastLine: false,
        theme: "vs-dark",
        wrappingIndent: "indent",
        wordWrap: 'wordWrapColumn',
        wordWrapColumn: 100,
        automaticLayout: true,
        tabSize: 2,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingStrategy: 'advanced',
        minimap: {
          enabled: false
        },
        overviewRulerLanes: 0
      });

    const saveText = () => {

      fetch(window.location.origin + path + '?notepad', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: editor.getValue() }),
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
    };
    document.getElementById('save-button')
      .addEventListener('click', saveText);
  } catch (err) {
    console.log(err);
  }

};





