(async () => {
  'use strict'

  const fs = require('fs')
  const path = require('path')

  const renderVirtualDirectory = require('./index.js')

  const renderPathPath = path.join(__dirname, 'sample-directory')
  const virtualDirectoryRenderPath = await renderVirtualDirectory({ absolutePath: renderPathPath })
  const stringifiedVirtualDirectory = JSON.stringify(virtualDirectoryRenderPath, null, '  ')

  fs.writeFileSync('./sample-virtual-directory.json', stringifiedVirtualDirectory, 'utf-8')
})()
