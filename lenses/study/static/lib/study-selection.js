const studySelection = (queryKey, monacoThing) => {

  const code = getMonacoSelection(monacoThing);
  if (!code) {
    alert('no code selected');
    return;
  }

  const lenseConfigonfig = {
    code,
    ext: config.ext
  }
  const queryValue = encodeURIComponent(JSON.stringify(lenseConfigonfig))
  const query = `?${queryKey}=${queryValue}`
  const url = window.location.origin + query

  window.open(url, '_blank')

}
