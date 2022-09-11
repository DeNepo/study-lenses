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
  .value-input {
    width: 13em;
  }
  .name-input {
    width: 7em;
  }
  #close-button {
    float: left;
  }
</style>`;

export const table = `
<div>
  <table>
    <tbody id="table-body">
      <tr>
        <th><button id='close-button'>X</button></th>
        <th>line</th>
        <th>name</th>
        <th>action</th>
        <th>value</th>
      </tr>
    </tbody>
  </table>

  <button id="add-row">+</button>
  <button id="remove-row">-</button>
</div>`;

export const init = (shadow) => {
  const tableBody = shadow.getElementById('table-body');

  const row = `
            <td><input type="radio" name="step" checked /></td>
            <td><input class="line-number" type="number" min="1" /></td>
            <td><input class='name-input' /></td>
            <td>
              <select>
                <option></option>
                <option>declare</option>
                <option>declare, init</option>
                <option>read</option>
                <option>assign</option>
              </select>
            </td>
            <td><input class='value-input' /></td>
          `;

  // -- handlers --
  const addRow = () => {
    const tr = document.createElement('tr');
    tr.innerHTML = row;
    tableBody.appendChild(tr);
  };

  const removeRow = () => {
    if (tableBody.childElementCount === 1) {
      return;
    }
    tableBody.removeChild(tableBody.lastChild);
  };

  // -- listeners --
  shadow.getElementById('add-row').addEventListener('click', addRow);
  shadow.getElementById('remove-row').addEventListener('click', removeRow);

  // -- init --
  addRow();
};
