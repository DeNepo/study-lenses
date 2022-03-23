import { generate } from './qlcjs.mjs';
import { config } from '../config.js';

generate.config = config.multipleChoice;

export { generate };
