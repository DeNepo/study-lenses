
const getMonacoSelection = (monacoThing) => {
  const editorSelection = monacoThing.getSelection();
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
  const getFromThis = typeof monacoThing.getModel === 'function'
    ? monacoThing.getModel()
    : monacoThing;
  for (let i = start; i <= end; i++) {
    selection += getFromThis.getLineContent(i) + '\n';
  }

  return selection;
}

