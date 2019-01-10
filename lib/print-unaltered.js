"use strict";

const print = require("./print");
const join = require("./join");
const indentString = require("indent-string");

function buildUnalteredFileList(renamingMap) {
    const list = [];
    for (const [key, value] of renamingMap) {
        if (key === value) {
            list.push(key);
        } else if (typeof value === "object") {
            if (key === value.newName) {
                list.push(key);
            }
            const innerList = buildUnalteredFileList(value.recursiveCallResult);
            list.push(...innerList.map(entry => join(key, entry)));
        }
    }
    return list;
}

module.exports = function printUnaltered(renamingMap) {
    if (renamingMap.amountUnaltered === 0) {
        print("No unaltered files.", "green");
        return;
    }

    print("Unaltered files:", "green");
    print(indentString(buildUnalteredFileList(renamingMap).join("\n"), 4));
};