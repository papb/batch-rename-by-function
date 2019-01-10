"use strict";

const indentString = require("indent-string");

module.exports = function printConflicts(conflicts) {
    if (conflicts.length === 0) return;
    const message = `Renaming conflicts:\n${conflicts.map(conflict => {
        const files = conflict.sourceNames.map(name => `"${name}"`).join("\n");
        return `  Files being renamed to "${conflict.targetName}":\n${indentString(files, 4)}`;
    }).join("\n")}`;
    return message;
};