'use strict';

const tutor = async (req, res, next) => {
  if (!req.query.hasOwnProperty('--tutor')) {
    next();
    return;
  }

  res.set('Content-Type', 'text/html');

  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      .center {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <a href="https://pythontutor.com/live.html#mode=edit" class="center" target="_blank">JS Tutor</a>

    <script>
      const redirect = confirm(\`redirecting to JS Tutor ...\n\nif this does not work try:\n- allowing pop-ups\n- or clicking the link below\`);
      if (redirect) {
        window.open("https://pythontutor.com/live.html#mode=edit", "_blank").focus();
      }
    </script>
  </body>
</html>`);
};

module.exports = tutor;
