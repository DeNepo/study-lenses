const studySelection = (queryKey, monacoThing, config = {}) => {

  const code = getMonacoSelection(monacoThing);
  if (!code) {
    alert('no code selected');
    return;
  }

  const baseConfig = {
    code,
    ext: config.ext
  }
  const finalConfig = Object.assign(baseConfig, config)
  const queryValue = encodeURIComponent(JSON.stringify(finalConfig))
  const query = `?${queryKey}=${queryValue}`
  const url = window.location.origin + query

  window.open(url, '_blank')

}
