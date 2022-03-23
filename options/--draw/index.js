module.exports = ({ config }) => {
  return {
    resource: {
      info: { ext: '.html' },
      content: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <title>sketchpad</title>
  <!-- https://github.com/C-Coding/Sketchpad -->
  <style>
  </style>
  <script src='${config.ownStatic}/sketchpad.js'></script>
</head>

<body>

  <div id="demo"></div>
  <script>
    window.onload = function () {
      const sketchpad = new Sketchpad({
        el: '#demo',
        toolBtnSize: 40,
        height: window.screen.availHeight,
        toolList: ['Brush', 'Line', 'Polygon', 'Eraser'],
        saveBtn: true,
        maxRecall: 50
      });
    }
  </script>
</body>

</html>
`,
    },
  };
};
