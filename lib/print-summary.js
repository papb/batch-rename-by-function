"use strict";

const print = require("./print");

module.exports = function printSummary(renamingMap, dryRun) {
    if (dryRun) {
        print(`Preview finished.`, "blue");
        print([
            `    Total files/folders: ${renamingMap.totalAmount}.`,
            `    Files/folders to be altered: ${renamingMap.totalAmount - renamingMap.amountUnaltered}.`,
            `    Files/folders that will remain unaltered: ${renamingMap.amountUnaltered}.`
        ].join("\n"));
    } else {
        print(`Finished renaming.`, "blue");
        print([
            `    Total files/folders: ${renamingMap.totalAmount}.`,
            `    Altered files/folders: ${renamingMap.totalAmount - renamingMap.amountUnaltered}.`,
            `    Unaltered files/folders: ${renamingMap.amountUnaltered}.`
        ].join("\n"));
    }
};