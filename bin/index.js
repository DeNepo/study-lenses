#!/usr/bin/env node

require('../src/server/index.js');
const config = require('../src/config/default.js');

// can later configurize the port number and initial param
//  and/or make them a CLI option
require('open')(`http://localhost:${config.PORT}/?${config.LENSE}`);
