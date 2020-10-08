const config = {
  "PORT": 4600,
  "LOGGER": {
    "STDOUT": true
  },
  "LENSE": "toc-doc",
  "STATIC": {
    "own": "own-resource",
    "shared": "shared-resource"
  }
};

config.ORIGIN = {
  "build": "https://janke-learning.github.io/study-lenses",
  "local": "http://localhost:" + config.PORT
}


module.exports = config;
