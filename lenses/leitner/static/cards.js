let aCardIsOpen = false;

const save = () =>
  fetch(window.location.origin + window.location.pathname + "?leitner", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leitner),
  })
    .then((response) => response.text())
    .then((message) => {
      // alert(message);
      console.log(message);
    })
    .catch((err) => {
      // alert(err.name + ": " + err.message);
      console.error("Error:", err);
    });

const init = async () => {
  window.leitner = leitner;
  console.log("boxes:", leitner.boxes);

  // render a button for each box
  const numberOfBoxes = Object.keys(leitner.boxes).length;
  let listOfButtons = "";
  for (let i = 1; i <= numberOfBoxes; i++) {
    const currentBox = leitner.boxes[i];
    const cardsInBox = currentBox.length;
    listOfButtons += `
  <li>
    <details ${currentBox.open ? "open" : ""}>
      <summary data-box='${i}' >${cardsInBox} card${
      cardsInBox === 1 ? "" : "s"
    }: <button id="${i}">next card</button></summary>
      <ol>${currentBox.reduce(
        (all, next) => all + `<li><a data-box='${i}' href='#'>${next}</a></li>`,
        ""
      )}</ol>
    </details>
  </li>`;
  }

  const boxesEl = document.getElementById("boxes");
  boxesEl.innerHTML = listOfButtons;

  let box;
  let card;

  document.getElementById("choose-card").addEventListener("click", (event) => {
    event.cancelBubble = true;

    if (event.target.nodeName === "SUMMARY") {
      leitner.boxes[event.target.dataset.box].open = !event.target.parentElement
        .open;
    }

    if (event.target.nodeName === "A") {
      box = Number(event.target.dataset.box);
      card = event.target.innerText;
    } else if (event.target.nodeName === "BUTTON") {
      box = Number(event.target.id);
      card = leitner.boxes[box][0];
    } else {
      return;
    }

    if (aCardIsOpen) {
      alert(
        `nope! you can only have one card open at a time.\n\nclose ${card} to keep studying.`
      );
      return;
    }

    if (!card) {
      alert(`nope, no cards in box ${box}`);
      return;
    }

    const cardTab = window.open();
    const waiting = setInterval(() => {
      if (cardTab !== null) {
        clearInterval(waiting);

        aCardIsOpen = true;
        prepareCardTab();
      }
    }, 100);
    const prepareCardTab = () => {
      cardTab.document.title = card;
      cardTab.card = card;
      cardTab.document.body.style = "height: 98vh; width: 98vw;";
      cardTab.onunload = () => {
        aCardIsOpen = false;
      };

      let putAwayButtons = "";
      for (let i = 1; i <= numberOfBoxes; i++) {
        putAwayButtons += `<input id='${i}' type='button' value='box ${i}'></input>`;
      }

      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = `<form>
          <text style="margin-right: 1em;">This card is in <text style="font-weight: bold;"><strong>box ${box}</strong></text>, where would you like to put it away?</text>
          ${putAwayButtons}
        </form>`;

      const gotItForm = tempContainer.firstChild;
      gotItForm.addEventListener("click", (event) => {
        if (isNaN(event.target.id)) {
          return;
        }

        const newBox = Number(event.target.id);
        leitner.boxes[box].shift();
        leitner.boxes[newBox].push(card);

        save().then(() => {
          aCardIsOpen = false;

          cardTab.alert(
            `all done! putting this card in box ${newBox} for later`
          );
          cardTab.close();
          init();
        });
      });
      cardTab.document.body.appendChild(gotItForm);

      const iframe = document.createElement("iframe");
      iframe.style = "height: 100%; width: 100%; border:none; overflow: auto;";
      iframe.src = `${window.location.origin}${window.location.pathname}/${card}?study`;
      cardTab.document.body.appendChild(iframe);
    };
  });
};

init();
