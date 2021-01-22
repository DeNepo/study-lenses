"use strict";

import variables from "./variables.js";
import functions from "./functions.js";
import error from "./error.js";

export const ADVICE = Object.assign({}, variables, functions, error);
