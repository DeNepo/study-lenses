import path from "path";

export const dirLinks = ({ dirElement, top = false }) => {
  const relativePath = path.join(
    dirElement.toCwd,
    dirElement.dir,
    dirElement.base
  );

  if (dirElement.type === "file") {
    //   if (dirElement.ext !== ".md") {
    //     return "";
    //   }

    return `<li><a href="${relativePath}?${
      dirElement.ext === ".js" || dirElement.ext === ".mjs"
        ? "corpus"
        : dirElement.ext === ".md"
        ? "render"
        : "highlight"
    }" target="_blank">${dirElement.base}</a></li>\n`;
  }

  if (dirElement.type === "directory") {
    const subIndex = Array.isArray(dirElement.children)
      ? dirElement.children
          .map((child) =>
            dirLinks({
              dirElement: child,
            })
          )
          .join("\n")
      : "";

    return top
      ? subIndex
      : `<li><details style="margin-bottom: 0px;"><summary><a href="${relativePath}?corpus" target="_blank">${dirElement.base}</a></summary>\n` +
          (subIndex
            ? '\n<ul style="list-style-type: none;">' + subIndex + "</ul>"
            : "") +
          "</details></li>";
  }

  return "";
};
