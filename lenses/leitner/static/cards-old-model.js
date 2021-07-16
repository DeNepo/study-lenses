(async () => {
  try {
    const res = await fetch(
      window.location.origin + window.location.pathname + "/leitner.json"
    );
    window.leitner = await res.json();
    console.log(leitner);

    const chooseCard = (cards) => {
      const randomBox = Math.ceil(Math.random() * 7);
      const choosableCards = cards.filter((card) => card.box <= randomBox);
      const randomIndex = Math.ceil(Math.random() * choosableCards.length - 1);
      const card = choosableCards[randomIndex];
      return card;
    };

    const chooseCardFromBox = (cards, box) => {
      const choosableCards = cards.filter((card) => card.box === box);
      if (!choosableCards) {
        return false;
      }
      const randomIndex = Math.ceil(Math.random() * choosableCards.length - 1);
      const card = choosableCards[randomIndex];
      return card;
    };

    const openCard = (card) => {
      const cardTab = window.open();
      cardTab.card = card;
      cardTab.document.body.style = "height: 98vh; width: 98vw;";

      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = `<form>
        <text>This card is in box <text id='box-number'>${
          card.box
        }</text>, you can choose to study it </text>
        <input id='more' type='button' value='more often' ${
          card.box === 1 ? 'style="text-decoration:line-through;"' : ""
        }>
        or
        <input id='less' type='button' value='less often' ${
          card.box === 7 ? 'style="text-decoration:line-through;"' : ""
        }>.
      </form>`;

      const gotItForm = tempContainer.firstChild;
      gotItForm.addEventListener("click", (event) => {
        const correct = event.target.id === "less";
        if (card.box < 7 && correct) {
          card.box += 1;

          save().then(() => {
            if (card.box === 7) {
              cardTab.document.getElementById("less").style =
                "text-decoration:line-through;";
            }
            cardTab.document.getElementById("more").style = "";
          });
        } else if (card.box > 1 && !correct) {
          card.box -= 1;

          save().then(() => {
            if (card.box === 1) {
              cardTab.document.getElementById("more").style =
                "text-decoration:line-through;";
            }
            cardTab.document.getElementById("less").style = "";
          });
        }

        cardTab.document.getElementById("box-number").innerHTML = card.box;
      });
      cardTab.document.body.appendChild(gotItForm);

      const iframe = document.createElement("iframe");
      iframe.style = "height: 100%; width: 100%; border:none; overflow: auto;";
      iframe.src = `${window.location.origin}${window.location.pathname}/${card.path}?study`;
      cardTab.document.body.appendChild(iframe);
    };

    document
      .getElementById("choose-card")
      .addEventListener("click", (event) => {
        const card =
          event.target.id === "all"
            ? chooseCard(leitner.cards)
            : chooseCardFromBox(leitner.cards, Number(event.target.id));

        if (!card) {
          alert("nope, no cards there");
        } else {
          openCard(card);
        }
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
