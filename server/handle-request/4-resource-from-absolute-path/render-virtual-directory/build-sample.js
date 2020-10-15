'use strict'

const fs = require('fs')
const path = require('path')

const renderVirtualDirectory = require('./index.js')

const renderPathPath = path.join(__dirname, '..')
const virtualDirectoryRenderPath = renderVirtualDirectory(renderPathPath)
const stringifiedVirtualDirectory = JSON.stringify(virtualDirectoryRenderPath, null, '  ')

fs.writeFileSync('./sample-virtual-directory.json', stringifiedVirtualDirectory, 'utf-8')
