"use strict";

const path = require("path");
const fs = require("fs");

// does not catch all duplicates
// does not notice already-present cards
const registerCards = (rootPath, boxes, subPath = "", registered = null) => {
  // all cards that exist and are already in a box
  if (!registered) {
    registered = [];
    for (const key in boxes) {
      const box = boxes[key];
      for (const relPath of box) {
        const fullPath = path.normalize(path.join(rootPath, relPath));
        if (registered.includes(relPath) || !fs.existsSync(fullPath)) {
          box.splice(box.indexOf(relPath), 1);
        } else {
          registered.push(relPath);
        }
      }
    }
  }

  const dir = fs.readdirSync(path.join(rootPath, subPath));
  for (const item of dir) {
    if (item.startsWith(".") || item === "node_modules") {
      continue;
    }

    const resourcePath = path.normalize(path.join(rootPath, subPath, item));
    if (fs.lstatSync(resourcePath).isDirectory()) {
      registerCards(
        rootPath,
        boxes,
        path.normalize(path.join(subPath, item)),
        registered
      );
      continue;
    }

    if (item.toLowerCase() === "readme.md") {
      console.log(item.toLowerCase());
      continue;
    }

    if (!item.endsWith(".md")) {
      continue;
    }

    const cardPath = "./" + path.join(subPath, item).split(path.sep).join("/");
    if (registered.includes(cardPath)) {
      continue;
    }

    boxes[1].push(cardPath);
  }
};

module.exports = registerCards;

/* from the previous data model:
  {
    "cards": [
      {
        "path": "./path/to/file.md",
        "box": 1
      }
    ]
  }
*/
// const registerCardsInArray = (rootPath, cards, subPath = "") => {
//   // keep all card entries for existing cards
//   for (let i = 0; i < cards.length; i++) {
//     const card = cards[i];
//     const absoluteCardPath = path.normalize(path.join(rootPath, card.path));
//     if (!fs.existsSync(absoluteCardPath)) {
//       cards.splice(i, 1);
//     }
//   }

//   const dir = fs.readdirSync(path.join(rootPath, subPath));
//   for (const item of dir) {
//     const resourcePath = path.normalize(path.join(rootPath, subPath, item));
//     if (fs.lstatSync(resourcePath).isDirectory()) {
//       registerCards(rootPath, cards, path.normalize(path.join(subPath, item)));
//       continue;
//     }

//     if (!resourcePath.endsWith(".md")) {
//       continue;
//     }

//     const cardIsRegistered = cards.find(
//       (card) => resourcePath === path.normalize(path.join(rootPath, card.path))
//     );

//     if (!cardIsRegistered) {
//       cards.push({
//         path: "./" + path.join(subPath, item).split(path.sep).join("/"),
//         box: 1,
//       });
//     }
//   }
// };
