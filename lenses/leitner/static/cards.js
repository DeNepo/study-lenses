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
      leitner.boxes[event.target.dataset.box].open =
        !event.target.parentElement.open;
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

      const putAwayButtons =
        box === numberOfBoxes
          ? `
            <input id='1' type='button' value='I got it wrong'></input>
            <input id='${box}' type='button' value='Put it back in box ${box}'></input>
          `
          : `
            <input id='${
              box + 1 > numberOfBoxes ? numberOfBoxes : box + 1
            }' type='button' value='I got it right'></input>
            <input id='1' type='button' value='I got it wrong'></input>
            <input id='${box}' type='button' value='Put it back in box ${box}'></input>
          `;

      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = `<form>
          <text style="margin-right: 1em;">Put this card away:</text>
          ${putAwayButtons}
        </form>`;

      const gotItForm = tempContainer.firstChild;
      gotItForm.addEventListener("click", (event) => {
        if (isNaN(event.target.id)) {
          return;
        }

        const newBox = Number(event.target.id);
        leitner.boxes[box].splice(leitner.boxes[box].indexOf(card), 1);
        leitner.boxes[newBox].push(card);

        save().then(() => {
          aCardIsOpen = false;

          cardTab.alert(`putting this card in box ${newBox}`);
          cardTab.close();
          init();
        });
      });
      cardTab.document.body.appendChild(gotItForm);

      cardTab.document.body.appendChild(document.createElement("hr"));

      const iframe = document.createElement("iframe");
      iframe.style = "height: 100%; width: 100%; border:none; overflow: auto;";
      iframe.src = `${window.location.origin}${window.location.pathname}/${card}?study`;
      cardTab.document.body.appendChild(iframe);
    };
  });
};

init();
