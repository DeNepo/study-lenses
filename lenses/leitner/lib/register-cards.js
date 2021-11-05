"use strict";

const path = require("path");
const fs = require("fs");

const allCards = (boxes) => {
  const boxValues = Object.values(boxes);
  return boxValues.flatMap((x) => x);
};

const uniqueCards = (boxes) => {
  const nonUniqueCards = allCards(boxes);
  return Array.from(new Set(nonUniqueCards));
};

const includesCardName = (boxes, name) => uniqueCards(boxes).includes(name);

const cardNameIsDuplicated = (boxes, name) => {
  const occurrences = allCards(boxes).filter((cardName) => cardName === name);
  return occurrences.length > 1;
};

const registerCards = async (
  rootPath,
  boxes,
  subPath = "",
  needsCleaning = true
) => {
  if (needsCleaning) {
    for (let key = Object.keys(boxes).length; key >= 1; key--) {
      const box = boxes[key];

      for (const relPath of box) {
        const cardName = relPath.split(path.sep).join("/");
        const absolutePath = path.normalize(path.join(rootPath, relPath));

        if (!fs.existsSync(absolutePath)) {
          box.splice(box.indexOf(cardName), 1);
        } else if (cardNameIsDuplicated(boxes, cardName)) {
          box.splice(box.indexOf(cardName), 1);
        }
      }
    }
  }

  // register existing files in this directory & subdirectories
  const dir = fs.readdirSync(path.join(rootPath, subPath));
  for (const item of dir) {
    if (item.startsWith(".") || item === "node_modules") {
      continue;
    }

    const resourcePath = path.normalize(path.join(rootPath, subPath, item));
    if (fs.lstatSync(resourcePath).isDirectory()) {
      await registerCards(
        rootPath,
        boxes,
        path.normalize(path.join(subPath, item))
      );
      continue;
    }

    if (item.toLowerCase() === "readme.md") {
      continue;
    }

    if (!item.endsWith(".md")) {
      continue;
    }

    const cardName = path.join(subPath, item).split(path.sep).join("/");

    if (!includesCardName(boxes, cardName)) {
      boxes[1].push(cardName);
    }
  }
};

module.exports = registerCards;
