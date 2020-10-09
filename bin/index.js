#!/usr/bin/env node

require('../src/server/index.js');
const config = require('config');

// can later configurize the port number and initial param
//  and/or make them a CLI option
require('open')(`http://localhost:${config.get('PORT')}/?${config.get('LENSE')}`);
