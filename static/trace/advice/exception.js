import { config } from '../data/config.js';
import { state } from '../data/state.js';
import { print } from '../lib/trace-log.js';

const nativeConsole = console;

export default {
  failure: (value, serial) => {
    // nativeConsole.error(value);
    // still figuring out aran errors

    nativeConsole.log('%c-> execution phase:', 'font-weight: bold;');

    if (value.message.includes('loopGuard')) {
      nativeConsole.log(
        '%c' + (value ? value.name : 'failure') + ': too much iteration',
        'color:red;',
        ' run or debug code for a complete error message',
      );
    } else {
      nativeConsole.log(
        '%c' + (value ? value.name : 'failure'),
        'color:red;',
        ' run or debug code for a complete error message',
      );
    }

    return value;
  },
};
