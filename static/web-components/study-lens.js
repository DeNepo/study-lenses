import { debounce } from './lib/debounce.mjs';

class StudyLens extends HTMLElement {
  _code = null;
  _lenses = [];
  _src = '';
  _lang = '.txt';
  _link = document.createElement('a');

  static langMap(lang) {
    const map = {
      javascript: 'js',
      logo: 'lgo',
    };
    return map[lang] || 'txt';
  }

  constructor(code = '', lang = '', lenses = []) {
    super();

    if (typeof code === 'string') {
      this._code = code;
    }

    if (lang) {
      this._lang = StudyLens.langMap(lang);
    }

    if (lenses.length !== 0) {
      this.setAttribute('lenses', lenses.join());
    }
  }

  connectedCallback() {
    if (this.hasAttribute('src')) {
      const src = this.getAttribute('src');
      this._src = src;
      this._lang = src.split('.').pop();
    }

    if (this.hasAttribute('lenses')) {
      this.lenses = this.getAttribute('lenses');
    }

    const initButton = document.createElement('button');
    initButton.innerHTML =
      (this._src ? `load ${this._src}` : 'load study lens') +
      (this.lenses ? `?${this.lenses.join('&')}` : '');
    initButton.addEventListener('click', () => this.setup());

    this.appendChild(initButton);

    if (this.hasAttribute('code')) {
      this._code = decodeURI(this.getAttribute('code'));
    }

    if (this.hasAttribute('lang')) {
      this._lang = this.getAttribute('lang');
    }

    if (this._code) {
      const code = document.createElement('code');
      code.innerText = this._code;

      const pre = document.createElement('pre');
      pre.style = `
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0%);
  text-align: left;`;

      pre.appendChild(code);

      this.appendChild(pre);
    }
  }

  get lenses() {
    return this._lenses;
  }

  set lenses(newLenses) {
    if (typeof newLenses === 'string') {
      this._lenses = newLenses
        .split(' ')
        .map((lensName) => lensName.trim())
        .filter((lensName) => lensName !== '');
    } else if (Array.isArray(newLenses)) {
      this._lenses = newLenses;
    }
  }

  resource(config = { stringify: false }) {
    if (typeof this._code !== 'string') {
      return config.stringify ? '{}' : {};
    }
    const pseudoResource = {
      resource: {
        content: this._code,
        info: {
          ext: `.${this._lang}`,
          type: 'file',
        },
      },
    };
    return config.stringify
      ? encodeURIComponent(JSON.stringify(pseudoResource))
      : pseudoResource;
  }

  async setup() {
    this.innerHTML = '';

    if (this.hasAttribute('code')) {
      this._code = decodeURI(this.getAttribute('code'));
    } else if (!this.hasAttribute('src')) {
      await new Promise((res) =>
        setTimeout(() => {
          if (this.innerText !== '') {
            this._code = this.innerText;
            this.innerHTML = '';
          }
          res();
        }, 0),
      );
    }

    const root = document.createElement('div');
    root.style = this.getAttribute('style');
    root.className = this.getAttribute('class');

    const lensConfig = document.createElement('div');
    if (this._src) {
      this._link.target = '_blank';
      this._link.innerHTML = this._src;
      this._link.href = `${window.location.origin}/${
        window.location.pathname
      }/../${this._src}?${this.lenses.join('&')}`;
      lensConfig.appendChild(this._link);
      const questionMark = document.createElement('text');
      questionMark.style = 'all: initial;';
      questionMark.innerText = ' ? ';
      lensConfig.appendChild(questionMark);
    } else {
      lensConfig.innerHTML = '<text style="all: initial;">lenses: </text>';
    }

    const lensesInput = document.createElement('input');
    lensesInput.value = this.lenses.join(' ');
    lensConfig.appendChild(lensesInput);

    if (!this._src) {
      const newTabButton = document.createElement('button');
      newTabButton.innerHTML = 'new tab';
      const URL = `${window.location.origin}/${
        window.location.pathname
      }?${this.lenses.join('&')}&--resource=${this.resource({
        stringify: true,
      })}`;
      newTabButton.addEventListener('click', () => window.open(URL, '_blank'));
      lensConfig.appendChild(newTabButton);
    }

    root.appendChild(lensConfig);

    const iframe = document.createElement('iframe');
    iframe.style = 'height: 100%; width: 100%; border: 0;';
    iframe.onload = () => {
      try {
        Reveal.layout();
      } catch (__) {}
    };
    root.appendChild(iframe);

    if (this._src) {
      iframe.src = `${this._src}?${this.lenses.join('&')}`;
    } else {
      iframe.src = `?${this.lenses.join('&')}&--resource=${await this.resource({
        stringify: true,
      })}`;
    }

    lensesInput.addEventListener(
      'keyup',
      debounce(async (event) => {
        const oldLenses = this.lenses;
        const newLenses = lensesInput.value;
        this.lenses = newLenses;
        if (oldLenses.toString() !== this.lenses.toString()) {
          if (this.hasAttribute('src')) {
            iframe.src = `${this._src}?${this.lenses.join('&')}`;
          } else {
            iframe.src = `?${this.lenses.join(
              '&',
            )}&--resource=${await this.resource({ stringify: true })}`;
          }
        }

        this._link.href = `${window.location.origin}/${
          window.location.pathname
        }/../${this._src}?${this.lenses.join('&')}`;

        event.stopPropagation();
        event.preventDefault();
        return false;
      }, 500),
    );

    const mainIframe = document.createElement('iframe');
    mainIframe.style = 'height: 100%; width: 100%; border: 0;';
    mainIframe.setAttribute('scrolling', 'no');
    mainIframe.onload = () => {
      mainIframe.contentDocument.body.appendChild(root);
      mainIframe.contentDocument.body.style = 'text-align: center;';
    };
    this.appendChild(mainIframe);
  }

  get url() {
    return `${window.location.origin}/${window.location.pathname}/../${
      this._src
    }?${this.lenses.join('&')}`;
  }
}

window.StudyLens = StudyLens;
customElements.define('study-lens', StudyLens);
