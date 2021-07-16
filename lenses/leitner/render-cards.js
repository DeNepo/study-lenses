const renderCards = ({ config, resource, leitner }) => {
  resource.info.ext = ".html";
  resource.content = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${
    config.title || `${resource.info.dir}/${resource.info.base}`
  }</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">


</head>

<body>

  <h2>Leitner box: ${resource.info.base}</h2>
  <p>
    study a flashcard from:
  </p>
  <div id='choose-card'>
    <ul id='boxes'></ul>
    <!-- old model <button id='all'>all boxes</button> -->
  </div>

  <script>const leitner = JSON.parse(decodeURI("${encodeURI(
    JSON.stringify(leitner)
  )}"));</script>
  <script type='module' src='${config.ownStatic}/cards.js'></script>


</body>

</html>
`;
  return { resource };
};

module.exports = renderCards;
