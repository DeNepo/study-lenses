export const getCommentedLenses = (node) => {
  let lensQueries = [];
  let currentSibling = node;

  while (true) {
    const previousSibling = currentSibling && currentSibling.previousSibling;
    if (previousSibling && previousSibling.nodeType === 8) {
      const queryRegex = /(?:\?)(?<query>([a-z0-9\-&=])*)/gim;
      for (const match of previousSibling.textContent.matchAll(queryRegex)) {
        const lenses = match.input
          .replace('?', '')
          .split(/\s/)
          .filter((lens) => lens);
        lensQueries.push(...lenses);
      }

      break;
    } else if (previousSibling instanceof Element) {
      break;
    }

    if (!currentSibling && !previousSibling) {
      break;
    } else {
      currentSibling = previousSibling;
    }
  }

  return lensQueries;
};
