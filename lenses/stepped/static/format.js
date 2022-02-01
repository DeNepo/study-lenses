export const format = (code = "") => {
  try {
    const formattedCode = prettier.format(code, {
      parser: "babel",
      plugins: prettierPlugins,
      printWidth: 80,
      proseWrap: "always",
      trailingComma: "all",
      tabWidth: 2,
      semi: true,
      bracketSpacing: true,
      singleQuote: true,
    });
    return formattedCode;
  } catch (err) {
    return code;
  }
};
