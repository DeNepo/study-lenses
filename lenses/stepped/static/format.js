export const format = (code = "") => {
  try {
    const formattedCode = prettier.format(code, {
      parser: "babel",
      plugins: prettierPlugins,
    });
    return formattedCode;
  } catch (err) {
    return code;
  }
};
