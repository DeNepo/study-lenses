export const eslint = (code = "") => {
  try {
    const pseudoResource = {
      resource: {
        content: code,
        info: {
          ext: ".js",
          type: "file",
        },
      },
    };
    // console.log(pseudoResource);

    const stringifiedResource = encodeURIComponent(
      JSON.stringify(pseudoResource)
    );

    // const baseConfig = {
    const finalConfig = {
      code,
      ext: ".js",
    };
    // const queryValue = encodeURIComponent(JSON.stringify(baseConfig));
    // const finalConfig = Object.assign(baseConfig, config);
    const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
    // if the full file is used, open lense with local configs from exercise
    //  otherwise don't, because anything syntax/runtime based will probably break for selections
    const activeStep = config.steps.find((step) => step.active);
    const url =
      window.location.origin +
      window.location.pathname +
      (activeStep ? "/" + activeStep.fileName : "") +
      (queryValue
        ? `?eslint&--resource=${stringifiedResource}`
        : `?${queryKey}=${queryValue}&--resource=${stringifiedResource}`);

    fetch(url)
      .then((res) => res.text())
      .then((lintResult) => console.log(lintResult))
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
    console.log("--- eslint is not configured for this resource ---");
  }
};
