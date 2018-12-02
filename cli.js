#!/usr/bin/env node
/* eslint no-process-exit: off */
"use strict";

const jetpack = require("fs-jetpack");
const chalk = require("chalk");
const yargs = require("yargs");

yargs.usage(`\nUsage: batch-rename-by-function path/to/my/renamer/file.js\n\n  Applies the function exported by the given JS file on every file present in the current folder, except the given JS file (if present), including folders.\n\n  The renaming function receives two parameters. The first is the name of the object (file/directory), and the second is a boolean which is true iff it is a directory. This way directories can be easily skipped, if desired.`);
yargs.example("batch-rename-by-function myRenamer.js");
// yargs.option("nested", {
//     alias: "recursive",
//     describe: "Whether to rename nested files",
//     type: "boolean",
//     default: false
// });
yargs.option("dry-run", {
    describe: "Show which renames would happen without actually performing them",
    type: "boolean",
    default: false
});
yargs.check(argv => {
    argv.dryRun = argv["dry-run"];

    // Check positionals
    const fileName = argv._[0];
    if (!fileName) throw new Error("Missing argument (path to JS file).");
    const fileExists = jetpack.exists(fileName);
    if (!fileExists) throw new Error("Invalid argument: file not found.");
    if (fileExists !== "file") throw new Error("Invalid argument: not a file.");
    argv.fileName = fileName.endsWith(".js") ? fileName : fileName + ".js";
    try {
        argv.renamer = require(jetpack.path(fileName));
    } catch (e) {
        throw new Error(`Unable to require("${jetpack.path(fileName)}").`);
    }
    if (typeof argv.renamer !== "function") {
        throw new Error("The JS file was found and processed by NodeJS but it did not export a function.");
    }

    return true;
});
const args = yargs.argv;

// ------------------ LOG & ERROR WRAPPERS ------------------ //

function print(str, color) {
    console.log("\n" + (color ? chalk[color](str) : str));
}
function errorDontWorryExit(message) {
    print(`Error: ${message}`, "red");
    print(`Try: batch-rename-by-function --help`);
    print(`Don't worry. All files remained unchanged.`, "yellow");
    process.exit(1);
}

if (args.dryRun) {
    print(`In '--dry-run' mode: files will not be really renamed (only a preview will be given).`, "green");
} else {
    print(`Not in '--dry-run' mode: files will be really renamed.`, "yellow");
}

print(`Reminder: folders themselves are included in the process!`, "yellow");

// ------------------ READ THINGS ------------------ //

const fileNames = jetpack.list('.');
const renameList = [];
let totalAmount = 0;
let amountUnaltered = 0;

// Compute changes
for (const name of fileNames) {
    if (name === args.fileName) {
        print(`Skipping file: ${name}.`, "green");
        continue;
    }

    const isDirectory = jetpack.exists(name) === "dir";
    let renamed = args.renamer(name, isDirectory);
    if (renamed === null || renamed === undefined) renamed = name;

    if (typeof renamed !== "string") {
        errorDontWorryExit(`The renaming function returned non-string for the input "${name}"!`);
    }
    if (renamed.length === 0) {
        errorDontWorryExit(`The renaming function returned empty string for the input "${name}"!`);
    }

    renameList.push({ old: name, new: renamed });

    totalAmount++;
    if (name === renamed) amountUnaltered++;
}

// ------------------ DO THE MAGIC ------------------ //

if (amountUnaltered > 0) {
    print("Unaltered files:", "green");
    renameList.filter(rename => rename.old === rename.new).forEach(rename => {
        console.log(`    ${rename.old}`);
    });
}
if (totalAmount > amountUnaltered) {
    print(`${args.dryRun ? "Files to be altered" : "Altered files"}:\n`, "yellow");
    const toBeAltered = renameList.filter(rename => rename.old !== rename.new);
    for (const rename of toBeAltered) {
        if (!args.dryRun) jetpack.rename(rename.old, rename.new);
        console.log(`    "${rename.old}" -> "${rename.new}".`);
    }
}

// ------------------ COMMAND SUMMARY ------------------ //

if (args.dryRun) {
    print(`Preview finished.`, "blue");
    print([
        `    Total files: ${totalAmount}.`,
        `    Files to be altered: ${totalAmount - amountUnaltered}.`,
        `    Files that will remain unaltered: ${amountUnaltered}.`
    ].join("\n"));
} else {
    print(`Finished renaming.`, "blue");
    print([
        `    Total files: ${totalAmount}.`,
        `    Altered files: ${totalAmount - amountUnaltered}.`,
        `    Unaltered files: ${amountUnaltered}.`
    ].join("\n"));
}

// ----------------------------------------------------- //