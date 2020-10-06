#!/usr/bin/env node

require('../src/index.js');

// can later configurize the port number and initial param
//  and/or make them a CLI option
require('open')('http://localhost:1337/?toc-doc');
