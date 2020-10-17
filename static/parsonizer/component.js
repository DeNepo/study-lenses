
class JSParsons extends HTMLElement {

  code = ''
  parson = null
  guesses = []

  constructor(code = '', language = 'js') {
    super()
    this.code = typeof code === 'string'
      ? code : 'const hello = "hi";';
    this.language = language;
    // console.dir(this)

    // process the code:
    //  - register all distractor lines
    const distractorReplacer = '$_$_$_$_$_$_$_$_$_$_$_$'
    const distractorReplaced = this.code
      .replace(/\/\/( |\t)+distractor\s*$/mg, distractorReplacer)
      .replace(/\/\/distractor\s*$/mg, distractorReplacer)

    const strippedCode = strip(distractorReplaced)
      .split(distractorReplacer)
      .join('// distractor')

    this.code = strippedCode

  }

  async connectedCallback() {

    function displayErrors(fb) {
      if (fb.errors.length > 0) {
        alert(fb.errors.toString());
      }
    }


    const buttonsContainer = document.createElement('div');
    this.appendChild(buttonsContainer);

    const newInstanceButton = document.createElement('button');
    newInstanceButton.innerHTML = 'new instance';
    newInstanceButton.onclick = (event) => {
      event.preventDefault();
      this.parson.shuffleLines();
    };
    buttonsContainer.appendChild(newInstanceButton);


    const modalContainerId = 'modal-container';
    const reviewGuessesA = document.createElement('a');
    reviewGuessesA.href = '#' + modalContainerId;
    const reviewButton = document.createElement('button');
    reviewButton.innerHTML = 'review guesses';
    reviewGuessesA.appendChild(reviewButton);
    buttonsContainer.appendChild(reviewGuessesA);


    buttonsContainer.appendChild(document.createTextNode(' || '))



    const feedbackButton = document.createElement('button');
    feedbackButton.innerHTML = 'get feedback';
    feedbackButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.parson.getFeedback();
    });
    feedbackButton.addEventListener('click', () => this.registerGuess(sortableId, guessesId));
    buttonsContainer.appendChild(feedbackButton);


    const debugButton = document.createElement('button');
    debugButton.innerHTML = 'debug solution';
    debugButton.onclick = () => {
      const studentCode = this.parson.getStudentCode()
      if (!studentCode) {
        alert('Your program has too few code fragments.')
        return
      }
      const stepThrough = eval
      const debuggered = 'debugger // added by the parsonizer\n\n' + studentCode
      stepThrough(debuggered)
    }
    buttonsContainer.appendChild(debugButton);

    const jsTutorButton = document.createElement('button');
    jsTutorButton.innerHTML = 'JS Tutor';
    jsTutorButton.onclick = () => {
      const studentCode = this.parson.getStudentCode()
      if (!studentCode) {
        alert('Your program has too few code fragments.')
        return
      }
      const encodedJST = encodeURIComponent(studentCode)
      const sanitizedJST = encodedJST
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/%09/g, '%20%20')
      const jsTutorURL = "http://www.pythontutor.com/live.html#code=" + sanitizedJST + "&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false"
      window.open(jsTutorURL, '_blank')
    }
    buttonsContainer.appendChild(jsTutorButton);


    const sortableId = 'sortable-code';
    const trashId = 'trash-code';

    const trash = document.createElement('div');
    trash.id = trashId;
    trash.className = 'sortable-code';
    this.appendChild(trash);

    const sortable = document.createElement('div');
    sortable.id = sortableId;
    sortable.className = 'sortable-code';
    this.appendChild(sortable);

    const clearBoth = document.createElement('div');
    clearBoth.style = 'clear:both;';
    this.appendChild(clearBoth);




    const guessesId = 'guesses-container';
    const modalContainer = document.createElement('div');
    modalContainer.id = modalContainerId;
    modalContainer.className = 'modal-window';
    modalContainer.innerHTML = `<div>
        <a href="#modal-close" title="Close" class="modal-close">close &times;</a>
        <div id="${guessesId}" style="overflow: scroll; display: flex; flex-direction: column;"></div>
      </div>`;
    this.appendChild(modalContainer);

    const documentOnReady = () => {
      this.parson = new ParsonsWidget({
        'sortableId': sortableId,
        'trashId': trashId,
        'max_wrong_lines': 100,
        'feedback_cb': displayErrors,
        'language': this.language
      });

      this.parson.init(this.code);
      this.parson.shuffleLines();
    };


    if (document.readyState !== 'loading') {
      documentOnReady();
    } else {
      document.addEventListener('DOMContentLoaded', documentOnReady);
    }
  };

  registerGuess(sortableId, guessesId) {

    const user_actions = this.parson.user_actions;
    const guess = user_actions[user_actions.length - 1];
    const guesses = this.guesses;

    const ul_guess = document.getElementById('ul-' + sortableId);
    const copy_guess = ul_guess.cloneNode(true);
    copy_guess.style = "list-style-type: none;";

    const guessLog = {};
    guessLog.view = copy_guess;
    guessLog.success = guess.errors.length === 0;
    guesses.push(guessLog);


    const the_guesses = document.getElementById(guessesId);

    const next_font = document.createElement("font");
    if (guess.success) {
      next_font.innerHTML = "yup";
      next_font.style = "color: green;";
    } else {
      next_font.innerHTML = "nope";
      next_font.style = "color: red;";
    };
    const next_message = document.createElement("p");
    next_message.innerHTML = guesses.length + ": ";
    next_message.appendChild(next_font);

    const next_div = document.createElement("div");
    next_div.className = "sortable-code";
    next_div.appendChild(next_message);
    next_div.appendChild(copy_guess);

    the_guesses.appendChild(next_div);
    the_guesses.appendChild(document.createElement('br'));

  }


}

customElements.define('js-parsons', JSParsons);

{
  const modalStyleTag = document.createElement('style');
  modalStyleTag.innerText = `
.modal-window {
  position: absolute;
  background-color: rgba(200, 200, 200, 0.75);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal-window:target {
  opacity: 1;
  pointer-events: auto;
}

.modal-window>div {
  width: 90vw;
  /* height: 80vh; */
  position: relative;
  margin: 5vh auto;
  padding: 2rem;
  background: #fff;
  color: #444;
}

.modal-window header {
  font-weight: bold;
}

.modal-close {
  color: #aaa;
  line-height: 4em;
  font-size: 80%;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  /* width: 70px; */
  width: 100%;
  text-decoration: none;
}

.modal-close:hover {
  color: #000;
}

.modal-window h1 {
  font-size: 150%;
  margin: 0 0 15px;
}
`;
  document.head.appendChild(modalStyleTag);

}
