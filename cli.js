#!/usr/bin/env node
"use strict";

global.Promise = require("bluebird");

// --------------- SETUP YARGS --------------- //

const jetpack = require("fs-jetpack");
const yargs = require("yargs");

yargs.usage(`\nUsage: batch-rename-by-function path/to/my/renamer/file.js\n\n  Applies the function exported by the given JS file on every file present in the current folder, except the given JS file (if present), including folders.\n\n  The renaming function receives two parameters. The first is the name of the object (file/directory), and the second is a data object with three fields: isDirectory (boolean), depth (int) and parentFolder (string).`);
yargs.example("batch-rename-by-function myRenamer.js");
yargs.option("recursive", {
    alias: "nested",
    describe: "Whether to rename nested files",
    type: "boolean",
    default: false
});
yargs.option("no-dry-run", {
    alias: ["force", "F"],
    describe: "Perform the actual renaming (if omitted, a dry-run will occur instead, i.e., just a simulation of the renamings).",
    type: "boolean",
    default: false
});
yargs.check(argv => {
    argv.dryRun = !argv["no-dry-run"];

    // Check positionals
    const fileName = argv._[0];
    if (!fileName) throw new Error("Missing argument (path to JS file).");
    const fileExists = jetpack.exists(fileName);
    if (!fileExists) throw new Error("Invalid argument: file not found.");
    if (fileExists !== "file") throw new Error("Invalid argument: not a file.");
    argv.renamerFileName = fileName.endsWith(".js") ? fileName : fileName + ".js";
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

// --------------- DO EVERYTHING --------------- //

const print = require("./lib/print");
const computeRenames = require("./lib/compute-renames");
const printUnaltered = require("./lib/print-unaltered");
const getConflictsMessage = require("./lib/get-conflicts-message");
const printSummary = require("./lib/print-summary");
const buildRenameCalls = require("./lib/build-rename-calls");
const renamer = require("./lib/smart-renamer");

if (args.dryRun) {
    print(`In dry-run mode: files will not be actually renamed (only a preview will be given) [DEFAULT].`, "green");
} else {
    print(`Not in dry-run mode: files will be actually renamed.`, "yellow");
}

print(`Reminder: folders themselves are included in the process!`, "yellow");

const renamingMap = computeRenames(args.renamer, args.recursive ? Infinity : 0, args.renamerFileName);

printUnaltered(renamingMap);

const renameCalls = buildRenameCalls(renamingMap);

const conflictsMessage = getConflictsMessage(renameCalls.conflicts);
if (conflictsMessage) print.errorDontWorryExit(conflictsMessage);

if (args.dryRun) {

    if (renameCalls.length > 0) {
        print(`Files to be altered:\n`, "yellow");
        for (const renameCall of renameCalls) {
            print(`    "${renameCall[0]}" -> "${renameCall[1]}".`, { newLine: false });
        }
    } else {
        print(`No files to be altered.`, "green");
    }
    printSummary(renamingMap, true);

} else {

    Promise.try(() => {
        if (renameCalls.length > 0) {
            print(`Altered files:\n`, "yellow");
            return Promise.mapSeries(renameCalls, renameCall => {
                return renamer.async(renameCall[0], renameCall[1]).then(() => {
                    print(`    "${renameCall[0]}" -> "${renameCall[1]}".`, { newLine: false });
                });
            }).then(() => {
                return renamer.executePostponedRenames.async();
            });
        } else {
            print(`No altered files.`, "green");
        }
    }).then(() => {
        printSummary(renamingMap, false);
    });

}