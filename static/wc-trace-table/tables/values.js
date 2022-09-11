export const style = `
<style>
  table,
  th,
  td {
    border: 1px solid black;
  }
  th {
    background-color: white;
  }
  table {
    border-collapse: collapse;
  }
  .line-number {
    width: 3em;
  }
  .varname-header {
    text-align: center;
    width: 10em;
    font-weight: bold;
  }
  .standard-column {
    width: 10em;
    text-align: center;
  }
  .side-by-side {
    display: flex;
    flex-direction: row;
  }
  #close-button {
    float: left;
  }
</style>`;

export const table = `
<div>
  <div class='side-by-side'>
    <table id="standard-table" class="standard-table">
      <tbody id="table-body">
        <tr>
          <th><button id='close-button'>X</button></th>
        </tr>
      </tbody>
    </table>
    <div>
      <button id="remove-column">-</button>
      <button id="add-column">+</button>
    </div>
  </div>
  <button id="add-row">+</button>
  <button id="remove-row">-</button>
</div>`;

export const init = (shadow) => {
  const state = {
    rows: 0,
    columns: 0,
  };

  // --- constant elements ---
  const tableBody = shadow.getElementById('table-body');

  // --- element strings ---
  const variableTh = () => {
    const th = document.createElement('th');
    th.innerHTML = `<input class="varname-header" placeholder='variable name' />`;
    return th;
  };
  const lineNumberTd =
    '<td><input class="line-number" type="number" min="1" /></td>';

  const lineNumberTr = () => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      lineNumberTd +
      new Array(state.columns)
        .fill("<td><input class='standard-column' /></td>")
        .join('');
    return tr;
  };

  const variableTd = () => {
    const td = document.createElement('td');
    td.innerHTML = "<input class='standard-column' />";
    return td;
  };

  // --- handlers ---
  const addRow = () => {
    tableBody.appendChild(lineNumberTr());
    state.rows++;
  };

  const removeRow = () => {
    if (tableBody.childElementCount === 1) {
      return;
    }
    tableBody.removeChild(tableBody.lastChild);
    state.rows--;
  };

  const addColumn = () => {
    const tableBodyChildren = Array.from(tableBody.children);
    tableBodyChildren[0].appendChild(variableTh());
    tableBodyChildren.shift(0);

    for (const child of tableBodyChildren) {
      child.appendChild(variableTd());
    }
    state.columns++;
  };

  const removeColumn = () => {
    if (tableBody.children[0].childElementCount === 1) {
      return;
    }

    const tableBodyChildren = Array.from(tableBody.children);
    for (const child of tableBodyChildren) {
      child.removeChild(child.lastChild);
    }
    state.columns--;
  };

  // --- listeners ---
  shadow.getElementById('add-row').addEventListener('click', addRow);
  shadow.getElementById('remove-row').addEventListener('click', removeRow);
  shadow.getElementById('add-column').addEventListener('click', addColumn);
  shadow
    .getElementById('remove-column')
    .addEventListener('click', removeColumn);

  // --- init ---
  addRow();
  addColumn();
};
