// const studySelection = (queryKey, monacoThing, config = {}, code = "") => {
//   const selectedCode = code || getMonacoSelection(monacoThing);
//   code = selectedCode || monacoThing.getValue();

//   const pseudoResource = {
//     content: code,
//     info: { ext: config.ext },
//   };
//   // console.log(pseudoResource);

//   const stringifiedResource = encodeURIComponent(
//     JSON.stringify(pseudoResource)
//   );

//   const baseConfig = {
//     code,
//     ext: config.ext,
//   };
//   // const queryValue = encodeURIComponent(JSON.stringify(baseConfig));
//   const finalConfig = Object.assign(baseConfig, config, config.locals);
//   const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
//   // if the full file is used, open lense with local configs from exercise
//   //  otherwise don't, because anything syntax/runtime based will probably break for selections

//   // const url = window.location.origin + `?${queryKey}=${queryValue}`;
//   const url = selectedCode
//     ? window.location.origin + `?--resource=${stringifiedResource}&${queryKey}`
//     : window.location.origin +
//       `?--resource=${stringifiedResource}&${queryKey}=${queryValue}`;
//   window.open(url, "_blank");
// };
