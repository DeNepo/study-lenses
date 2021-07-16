(async () => {
  try {
    // const res = await fetch(
    //   window.location.origin + window.location.pathname + "/leitner.json"
    // );
    // const leitner = await res.json();
    window.leitner = leitner;
    console.log("boxes:", leitner.boxes);

    // render a button for each box
    const numberOfBoxes = Object.keys(leitner.boxes).length;
    let listOfButtons = "";
    for (let i = 1; i <= numberOfBoxes; i++) {
      listOfButtons += `<li><button id="${i}">box ${i}</button></li>`;
    }
    document.getElementById("boxes").innerHTML = listOfButtons;

    let aCardIsOpen = false;
    let box;
    let card;

    document
      .getElementById("choose-card")
      .addEventListener("click", (event) => {
        if (aCardIsOpen) {
          alert(
            `nope! you can only have one card open at a time.\n\nclose ${card} to keep studying.`
          );
          return;
        }

        box = Number(event.target.id);

        card = leitner.boxes[box][0];

        if (!card) {
          alert(`nope, no cards in box ${box}`);
          return;
        }

        aCardIsOpen = true;

        const cardTab = window.open();
        cardTab.card = card;
        cardTab.document.body.style = "height: 98vh; width: 98vw;";
        cardTab.onunload = () => (aCardIsOpen = false);

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
            cardTab.alert(
              `all done! putting this card in box ${box} for later`
            );
            cardTab.close();
          });
        });
        cardTab.document.body.appendChild(gotItForm);

        const iframe = document.createElement("iframe");
        iframe.style =
          "height: 100%; width: 100%; border:none; overflow: auto;";
        iframe.src = `${window.location.origin}${window.location.pathname}/${card}?study`;
        cardTab.document.body.appendChild(iframe);
      });

    window.save = () =>
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
  } catch (err) {
    console.error(err);
  }
})();
