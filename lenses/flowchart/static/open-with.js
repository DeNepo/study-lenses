const openWith = (encodedCode, lens) => {
  const pseudoResource = {
    resource: {
      content: decodeURIComponent(encodedCode),
      info: { ext: ".js", base: "resource.js" },
    },
  };

  const stringifiedResource = encodeURIComponent(
    JSON.stringify(pseudoResource)
  );

  const query = `${lens}&--resource=${stringifiedResource}`;
  const url = window.location.origin + "?" + query;
  window.open(url, "_blank");
};
