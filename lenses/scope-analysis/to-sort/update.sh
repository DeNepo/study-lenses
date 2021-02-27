set -x
for module in parser codegen scope fuzzer reducer validator template ast; do
  echo 'window.'${module}' = require("shift-'${module}'");' | ./node_modules/.bin/browserify - | ./node_modules/.bin/uglifyjs --compress --mangle -o js/shift-${module}.js
done