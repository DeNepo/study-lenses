import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/trace-log.js";

export default {
  failure: (value, serial) => {
    // console.error(value);
    // still figuring out aran errors
    if (value.message.includes("loopGuard")) {
      console.log(
        "%c" + (value ? value.name : "failure") + ": too much iteration",
        "color:red;",
        " run or debug code for a complete error message"
      );
    } else {
      console.log(
        "%c" + (value ? value.name : "failure"),
        "color:red;",
        " run or debug code for a complete error message"
      );
    }
    console.log("-> execution phase");

    return value;
  },
};
