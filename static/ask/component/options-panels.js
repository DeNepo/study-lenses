export const openEndedPanel = `
  <form  id='ask-open-ended-config' style="display: block;">
    question types: <br>
    <!-- <input type="range" min="1" max="4"  id="level"> -->
    <input id='level-1' type='checkbox' /> <label for='level-1'>the code</label> <br>
    <input id='level-2' type='checkbox' /> <label for='level-2'>how it works</label> <br>
    <input id='traces' type='checkbox' /> <label for='traces'>variable traces</label> <br>
    <input id='level-3' type='checkbox' /> <label for='level-3'>connections</label> <br>
    <input id='level-4' type='checkbox' /> <label for='level-4'>goals</label> <br>
    <input id='level-5' type='checkbox' /> <label for='level-5'>user experience</label> <br>
    <hr>
    language features: <br>
    <input id='variables' type='checkbox' /> <label for='variables'>variables</label> <br>
    <input id='data' type='checkbox' /> <label for='data'>data</label> <br>
    <input id='operators' type='checkbox' /> <label for='operators'>operators</label> <br>
    <input id='controlFlow' type='checkbox' /> <label for='controlFlow'>control flow</label> <br>
    <input id='functions' type='checkbox' /> <label for='functions'>functions</label> <br>
    <hr>
    <input id='alert' type='checkbox' /> <label for='alert'>alert questions</label> <br>
    <br>
    <button id='guide'>guide</button>
  </form>`;

export const multipleChoicePanel = `
  <form id='ask-multiple-choice-config' style="display: none;">
    question types: <br>
    <input id='VariableDeclaration' type='checkbox' checked/> <label for='VariableDeclaration'>variables</label> <br>
    <input id='VariableTrace' type='checkbox' checked/> <label for='VariableTrace'>trace</label> <br>
    <input id='LoopEnd' type='checkbox' /> <label for='LoopEnd'>loops</label> <br>
    <input id='FunctionName' type='checkbox' /> <label for='FunctionName'>function names</label> <br>
    <input id='ParameterName' type='checkbox' /> <label for='ParameterName'>parameter names</label> <br>
    <input id='ParameterValue' type='checkbox' /> <label for='ParameterValue'>parameter values</label> <br>
    <input id='MethodCall' type='checkbox' /> <label for='MethodCall'>method calls</label> <br>
  </form>`;
