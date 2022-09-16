/*
  can add different types of rows
    unary:   op | value -> evaluates to
    binary:  value | op | value -> evaluates to
    ternary: value ? value : value -> evaluates to

  filling in values
    by hand
    selecting previous ones?

*/

export const style = `
<style>
  table,
  th,
  td {
    border: 1px solid black;
    white-space: nowrap;
    overflow-x: auto;
  }
  th {
    background-color: white;
  }
  table {
    border-collapse: collapse;
  }
  input {
    display: inline-block;
    text-align: center;
  }
  .value {
    width: 5em;
  }
  .operator {
    width: 3em;
  }
  .line-number {
    width: 3em;
  }
  .value-input {
    width: 13em;
  }
  #close-button {
    float: left;
  }
</style>`;

export const table = `
<div style='background-color: white;'>
  <table>
    <tbody id="table-body">
      <tr>
        <th><button id='close-button'>X</button></th>
        <th>expression</th>
        <th>evaluates to</th>
      </tr>
    </tbody>
  </table>

  add step:
  <button id="unaryPre">unary prefix</button>
  <button id="unaryPost">unary postfix</button>
  <button id="binary">binary</button>
  <!-- <button id="shortCircuit">short-circuit</button> -->
  <button id="ternary">ternary</button>
  || <button id="remove-row">remove step</button>
</div>`;

export const init = (shadow) => {
  const tableBody = shadow.getElementById('table-body');

  let step = 1;

  const rows = {
    unaryPre: () => `
            <td><text>${step}. </text></td>
            <td>
              <input placeholder='op' class='operator' />
              <input placeholder='value' class='value' />
            </td>
            <td><input class='value-input' /></td>
          `,
    unaryPost: () => `
            <td><text>${step}. </text></td>
            <td>
              <input placeholder='value' class='value' />
              <input placeholder='op' class='operator' />
            </td>
            <td><input class='value-input' /></td>
          `,
    binary: () => `
            <td><text>${step}. </text></td>
            <td>
              <input placeholder='value 1' class='value' />
              <input placeholder='op' style='width: 2em;' class='operator' />
              <input placeholder='value 2' class='value' />
            </td>
            <td><input class='value-input' /></td>
          `,
    ternary: () => `
            <td><text>${step}. </text></td>
            <td>
              <input placeholder='value 1' class='value' /> ?
              <input placeholder='value 2' class='value' /> :
              <input placeholder='value 3' class='value' />
            </td>
            <td><input class='value-input' /></td>
          `,
    shortCircuit: () => `
            <td><text>${step}. </text></td>
            <td>
              <input placeholder='value 1' class='value' />
              <input placeholder='op' class='operator' />
              <input placeholder='(right side)' class='value' readonly />
            </td>
            <td><input class='value-input' /></td>
          `,
  };

  // -- handlers --
  const addRow = (event) => {
    const tr = document.createElement('tr');
    tr.innerHTML = rows[event.target.id]();
    tableBody.appendChild(tr);

    step++;
  };

  const removeRow = () => {
    if (tableBody.childElementCount === 1) {
      return;
    }
    tableBody.removeChild(tableBody.lastChild);

    step--;
  };

  // -- listeners --
  shadow.getElementById('unaryPre').addEventListener('click', addRow);
  shadow.getElementById('unaryPost').addEventListener('click', addRow);
  shadow.getElementById('binary').addEventListener('click', addRow);
  // shadow.getElementById('shortCircuit').addEventListener('click', addRow);
  shadow.getElementById('ternary').addEventListener('click', addRow);
  shadow.getElementById('remove-row').addEventListener('click', removeRow);
};
