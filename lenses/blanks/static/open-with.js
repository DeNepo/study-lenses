const openWith = (code, lens) => {
  const pseudoResource = {
    resource: {
      content: code,
      info: { ext: ".js" },
    },
  };

  const stringifiedResource = encodeURIComponent(
    JSON.stringify(pseudoResource)
  );

  const query = `${lens}&--resource=${stringifiedResource}`;
  const url = window.location.origin + "?" + query;
  window.open(url, "_blank");
};
