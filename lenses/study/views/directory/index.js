'use strict';

const fs = require('fs');
const path = require('path');

const MarkdownSSR = require('../markdown/index.js');

const { searchFilterRegex, searchFilterIncludes } = require('./search-filter');

let searchQuery = '';
let searchType = 'includes';
let flags = '';
let regexError = null;

class DirectorySSR extends MarkdownSSR {
  constructor({ config, resource, requestData }) {
    searchQuery = config.queryValue.searchQuery || '';
    searchType = config.queryValue.searchType || 'includes';
    flags =
      typeof config.queryValue.flags === 'string'
        ? config.queryValue.flags
        : '';
    regexError = null;

    if (typeof searchQuery === 'string' && searchQuery !== '') {
      if (searchType === 'regex') {
        // console.log("------ ", searchQuery, flags);
        try {
          const searchRegex = new RegExp(searchQuery, flags);
          resource.content = searchFilterRegex(resource.content, searchRegex);
        } catch (err) {
          regexError = err.message;
        }
        // console.log(resource.content);
        // console.log(JSON.stringify(resource.content, null, "  "));
      } else if (searchType === 'includes') {
        resource.content = searchFilterIncludes(resource.content, searchQuery);
      }
    }

    // console.log(resource);
    let readmeContent = '';
    try {
      const readmePath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base,
        'README.md',
      );
      // console.log(readmePath);
      readmeContent = fs.readFileSync(readmePath, 'utf-8');
      // console.log(content);
    } catch (o_0) {
      // console.error(o_0);
    }

    const dirRegex =
      /(<!--[ \t]*begin[ \t]*dir[ \t]*-->)([\s\S]*)(<!--[ \t]*end[ \t]*dir[ \t]*-->)/gim;
    if (!dirRegex.test(readmeContent)) {
      readmeContent =
        `<!-- BEGIN DIR --><!-- END DIR --> \n <hr> <hr> \n\n` + readmeContent;
    }

    super({
      config,
      resource,
      content: readmeContent,
      requestData,
      markedOptions: {
        baseUrl: `/./${requestData.path}/`,
      },
    });
  }

  panel() {
    const superPanel = super.panel();

    const panel = `
    <!-- <span id='new-tab-container'>
      <input type='checkbox' id='new-tab'></input></label for='new-tab'>open in new tab</label>
    </span> -->
    <hr>
    <form onsubmit="return false;">
      <input id="search-button" type="button" value="search:" />

      <input name="search" id="search-input" style="width: 15em;" value="${
        searchQuery || ''
      }" />

      <input type="checkbox" ${
        searchType === 'regex' ? 'checked' : ''
      } name="regex" id="regex" /><label for="regex">regex</label>

      <div id='flags' style="display: ${
        searchType === 'regex' ? 'inline-block' : 'none'
      };">
        <input type="checkbox" ${
          flags && flags.includes('g') ? 'checked' : ''
        } name="g" id="g" /><label for="g">g</label>
        <input type="checkbox" ${
          flags && flags.includes('i') ? 'checked' : ''
        } name="i" id="i" /><label for="i">i</label>
        <input type="checkbox" ${
          flags && flags.includes('m') ? 'checked' : ''
        } name="m" id="m" /><label for="m">m</label>
        <input type="checkbox" ${
          flags && flags.includes('s') ? 'checked' : ''
        } name="s" id="s" /><label for="s">s</label>
        <input type="checkbox" ${
          flags && flags.includes('u') ? 'checked' : ''
        } name="u" id="u" /><label for="u">u</label>
        <input type="checkbox" ${
          flags && flags.includes('y') ? 'checked' : ''
        } name="y" id="y" /><label for="y">y</label>
      </div>
    </input>
    ${regexError ? `<pre style="color: red;">${regexError}</pre>` : ''}`;

    return panel + '\n\n' + superPanel;
  }
}

module.exports = DirectorySSR;
