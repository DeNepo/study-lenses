const config = {
  // default value is the base-class
  "params": [
    ["live-study", "extension"],
    "docco-next",
    "gitlet"
  ],

  // static options.  these are the defaults
  "static": {
    "panel": true,
    "readOnly": true,
    "format": false,
    "reset": false,
    "save": false,
    "language": "text",
    "parsons": true,
    "diff": true
  },


  "scripts": [],


  "build": false,

  // each type can have it's own options
  //  default for each is found in public/extensions
  "extensions": {
    "markdown": {},
    "javascript": {}
  }
}
