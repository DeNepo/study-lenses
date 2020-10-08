
let onceClicked = false;
const parsonizeSelection = async (monacoThing) => {

  if (!onceClicked) {

    onceClicked = true;

    [
      './live-study-static/static-study/parsonizer/component.js',
      './live-study-static/static-study/parsonizer/jquery.min.js',
      './live-study-static/static-study/parsonizer/lis.js',
      './live-study-static/prism/script.js',
      // './live-study-static/lib/strip-comments.js',
    ].forEach(path => {
      var newScript = document.createElement("script");
      newScript.src = path;
      document.body.appendChild(newScript);
    });
    [
      "./live-study-static/static-study/parsonizer/parsons.css",
      "./live-study-static/prism/style.css",
    ].forEach(path => {
      var newLink = document.createElement("link");
      newLink.rel = 'stylesheet';
      newLink.href = path;
      document.body.appendChild(newLink);
    });

    setTimeout(() => {
      [
        './live-study-static/static-study/parsonizer/jquery-ui.min.js',
        './live-study-static/static-study/parsonizer/jquery.ui.touch-punch.min.js',
        './live-study-static/static-study/parsonizer/parsons.js',
      ].forEach(path => {
        var newScript = document.createElement("script");
        newScript.src = path;
        document.body.appendChild(newScript);
      });
    }, 800);
    setTimeout(theParsonsRest, 1000, monacoThing);
    return;
  }
  // render and append a new js-parsons component

  theParsonsRest(monacoThing);

};


const theParsonsRest = (monacoThing) => {

  const code = getSelection(monacoThing);
  if (!code) {
    alert('no code selected');
    return;
  }

  const pathSplitByDot = window.location.pathname.split('.');
  const parsonsComponent = new JSParsons(strip(code), pathSplitByDot[pathSplitByDot.length - 1]);
  parsonsComponent.style = 'height:90vh; width:100vw;';

  const modalId = Math.random().toString(36).substring(7);
  const modalContainer = document.createElement('div');
  modalContainer.id = modalId;
  modalContainer.style = 'height:90vh; width:100vw;';
  modalContainer.className = 'modal-window';
  modalContainer.innerHTML = `<div>
        <a href="#modal-close" title="Close" class="modal-close">close &times;</a>
      </div>`;
  modalContainer.firstElementChild.appendChild(parsonsComponent);
  modalContainer.firstElementChild.style = 'height:90vh; width:100vw;';
  modalContainer.firstElementChild.firstElementChild.addEventListener('click', () => document.body.removeChild(modalContainer));
  document.body.appendChild(modalContainer);
  const url = location.href;
  location.href = "#" + modalId;
  history.replaceState(null, null, url);

}
