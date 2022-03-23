import util from 'util';
import fs from 'fs';

const writeFilePromise = util.promisify(fs.writeFile);

export default async ({ config, resource, requestData, responseData }) => {
  if (config.locals.save === true && requestData.method === 'POST') {
    try {
      await writeFilePromise(resource.path, requestData.body.text, 'utf-8');
      resource.content = ': changes were saved';
      // console.log(resource.content);
      resource.info.ext = '.txt';
      return {
        resource,
      };
    } catch (err) {
      console.log(err);
      responseData.status = 500;
      resource.content =
        'unable to save changes.  check server logs for more info';
      resource.info.ext = '.txt';
      return {
        resource,
        responseData,
      };
    }
  }

  config.code = resource.content;

  resource.info.ext = '.html';
  resource.content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Logo</title>

    <script src="${config.sharedStatic}/p5.min.js"></script>
    <script src="${config.sharedStatic}/p5.dom.min.js"></script>
    <script src="${config.ownStatic}/turtle.js"></script>
    <script src="${config.ownStatic}/expression.js"></script>
    <script src="${config.ownStatic}/parser.js"></script>
    <script src="${config.ownStatic}/command.js"></script>
    <script src="${config.ownStatic}/commandList.js"></script>
    <script src="${config.ownStatic}/bounding_box.js"></script>
    <script src="${config.ownStatic}/animation.js"></script>

    <link rel="stylesheet" href="${config.ownStatic}/style.css" />
    <!-- <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"> -->
  </head>

  <body>
    <div id="banner">
      <img
        src="${config.ownStatic}/assets/img/turtle.svg"
        style="width: 40px; height: 40px"
        alt=""
      />
      <span id="LOGO">LOGO</span>

      <button id='guide'>guide</button>
      ||
      <button id='parsons'>parsonize</button>
      <button id='highlight'>highlight</button>
      <button id='print'>print</button>
      <button id="parsons=diff">diff</button>
      ||
      ${config.locals.save ? `<button id="save">save</button>` : ''}


      <select id="testdata" style="width: 150px"></select>

      <span
        class="ico_btn_dark"
        id="recentre"
        style="padding-top: 2px"
        tooltip="Recentre"
      >
        <img
          src="${config.ownStatic}/assets/img/reset.svg"
          style="width: 30px; height: 30px; padding: 2px"
          alt=""
        />
      </span>

      <span
        class="ico_btn_dark"
        id="bgcolor"
        style="padding-top: 2px"
        tooltip="Random Background Color"
      >
        <img
          src="${config.ownStatic}/assets/img/color.svg"
          style="width: 30px; height: 30px; padding: 2px"
          alt=""
        />
      </span>
    </div>

    <div style="display: flex; flex-direction: row;">

      <!-- Editor -->
      <!-- <div id="resize-handle" class="resize-handle"><div></div></div> -->
      <div id="editor-container" class="editor-container">
        <div id="code_bg"></div>
        <div class="textarea-container">
          <textarea
            id="code"
            cols="100"
            rows="15"
            autocomplete="false"
            spellcheck="false"
            autofocus
          ></textarea>
        </div>
      </div>

      <!-- Canvas div -->
      <div id="logo-canvas"></div>

    </div>

    <!-- Icon Copyright info -->
    <small class="copyright-footer">
      Icons made by
      <a href="https://www.flaticon.com/authors/freepik" title="Turtle"
        >Turtle</a
      >
      from
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
      is licensed by
      <a
        href="http://creativecommons.org/licenses/by/3.0/"
        title="Creative Commons BY 3.0"
        target="_blank"
        >CC 3.0 BY</a
      >
    </small>

    <script>
      const config = JSON.parse(decodeURI("${encodeURI(
        JSON.stringify(config),
      )}"));
    </script>
    <script src="${config.ownStatic}/sketch.js"></script>
    <!-- <script>
      editor.value(decodeURI("${encodeURI(resource.content)}"))
    </script> -->
  </body>
</html>
`;

  return { resource };
};
