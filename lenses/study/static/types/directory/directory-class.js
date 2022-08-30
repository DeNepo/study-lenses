import { MarkdownFE } from '../markdown/markdown-class.js';

export class DirectoryFE extends MarkdownFE {
  constructor(config) {
    super(config);
    this.initDirectoryUI();
  }

  initDirectoryUI() {
    const search = (event) => {
      const searchConfig = {
        searchQuery: event.target.form.search.value,
        searchType: event.target.form.regex.checked ? 'regex' : 'includes',
        flags:
          (event.target.form.g.checked ? 'g' : '') +
          (event.target.form.i.checked ? 'i' : '') +
          (event.target.form.m.checked ? 'm' : ''),
      };
      console.log(searchConfig);

      const searchURL =
        window.location.origin +
        window.location.pathname +
        '?study=' +
        encodeURIComponent(JSON.stringify(searchConfig));

      window.open(searchURL, '_self');
    };

    document.getElementById('search-button').addEventListener('click', search);
    document
      .getElementById('search-input')
      .addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
          search(event);
        }
        return false;
      });

    document.getElementById('regex').addEventListener('change', (event) => {
      if (event.target.checked) {
        document.getElementById('flags').style.display = 'inline-block';
      } else {
        document.getElementById('flags').style.display = 'none';
      }
    });

    const newTabCheckbox = document.getElementById('new-tab');

    if (newTabCheckbox) {
      const base = document.createElement('base');
      base.target = '_blank';

      const toggleNewTab = (e) => {
        if (newTabCheckbox.checked) {
          newTabCheckbox.checked = false;
          try {
            document.head.removeChild(base);
          } catch (err) {}
        } else {
          newTabCheckbox.checked = true;
          document.head.appendChild(base);
        }
      };

      newTabCheckbox.addEventListener('change', toggleNewTab);
      document
        .getElementById('new-tab-container')
        .addEventListener('click', toggleNewTab);
    }
  }
}
