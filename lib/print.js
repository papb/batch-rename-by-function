/* eslint no-process-exit: off */
/* eslint no-console: off */
"use strict";

const chalk = require("chalk");

module.exports = function print(str, colorOrOptions) {
    const options = typeof colorOrOptions === "object" ? colorOrOptions : {
        color: colorOrOptions,
        newLine: true
    };
    console.log((options.newLine ? "\n" : "") + (options.color ? chalk[options.color](str) : str));
};
module.exports.errorDontWorryExit = function(message) {
    module.exports(`Error: ${message}`, "red");
    module.exports(`Try: batch-rename-by-function --help`);
    module.exports(`Don't worry. All files remained unchanged.`, "yellow");
    process.exit(1);
};