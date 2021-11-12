export const domToPojo = (
  element = document.createElement("DIV"),
  visited = new WeakMap()
) => {
  if (element === null) {
    return element;
  }

  // cannot do an instanceof check because
  //  when working with iFrames it's not the same HTMLElement
  if (!element.__proto__.constructor.name.endsWith("Element")) {
    throw new TypeError("argument is not an HTML element");
  }

  if (visited.has(element)) {
    return visited.get(element);
  }

  const newNode = {
    id: element.id,
    nodeName: element.nodeName,
    innerHTML: element.innerHTML,
    classList: Array.from(element.classList),
  };

  visited.set(element, newNode);

  newNode.children = Array.from(element.children).map((child) =>
    domToPojo(child, visited)
  );

  newNode.parentElement = domToPojo(element.parentElement, visited);

  return newNode;
};
