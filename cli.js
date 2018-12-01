#!/usr/bin/env node
/* eslint no-process-exit: off */
"use strict";

const VERSION = "1.1.0";

const USAGE_TEXT = `    Usage
    
        $ batch-rename-by-function <js-file-which-exports-the-renaming-function>
        
        Takes the function exported by the JS file (by module.exports)
        and applies it to every file present in the current folder,
        including folders (with the exception of the passed JS file
        itself, in case it is in the current folder).

        The renaming function receives two parameters. The first is the name
        of the object (file/directory), and the second is a boolean which is
        true iff it is a directory. This way directories can be easily skipped.

    Options
    
        --force, -F

            Perform the actual renaming (without it, for safety, just
            a preview is made)

        --version

        --help

    Examples
    
        $ batch-rename-by-function myRenamer.js
        $ batch-rename-by-function -F myRenamer.js`;

// ------------------ LOG & ERROR WRAPPERS ------------------ //

function say(str) {
    if (say.notTheFirstTime) {
        console.log("\n" + str);
    } else {
        say.notTheFirstTime = true;
        console.log("\n" + str);
    }
}
function errorDontWorryExit(message) {
    say(chalk.red("Error: " + message));
    say("Try: batch-rename-by-function --help");
    say(chalk.yellow("Don't worry. All files remained unchanged."));
    process.exit(1);
}

// ------------------ IMPORTS ------------------ //

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const chalk = require('chalk');

// ------------------ PARSE ARGS ------------------ //

const [,,...args] = process.argv;

if (!args.length || (args.length === 1 && (args[0] === "--help" || args[0] === '-h'))) {
    say(USAGE_TEXT);
    process.exit();
}

if (args.length === 1 && (args[0] === "--version" || args[0] === '-v')) {
    say("batch-rename-by-function v" + VERSION);
    process.exit();
}

if (args.length > 2) {
    errorDontWorryExit("Too many args.");
}

let renamingFunction = undefined;
let arg = undefined;
let force = false;

if (args.length === 1) {
    arg = args[0];
} else if (args[0] === "--force" || args[0] === "-F") {
    arg = args[1];
    force = true;
} else if (args[1] === "--force" || args[1] === "-F") {
    arg = args[0];
    force = true;
} else if (args.length === 2) {
    errorDontWorryExit("Error: Unable to parse args.");
}

const pathToFunction = slash(path.join(process.cwd(), arg));
try {
    renamingFunction = require(pathToFunction);
} catch (e) {
    errorDontWorryExit(`Unable to require("${pathToFunction}").`);
}

if (typeof renamingFunction !== "function") {
    errorDontWorryExit("The JS file was found and processed by NodeJS but it did not export a function.");
}

// ------------------ DONE CHECKING ARGS ------------------ //

say(chalk.green("Command inputs OK."));

if (force) {
    say(chalk.yellow("In '--force' mode: files will be renamed."));
} else {
    say(chalk.green("Not in '--force' mode: files will not be renamed, only a preview will be given."));
}

say(chalk.yellow("Reminder: folders themselves are included in the process!"));

// ------------------ READ THINGS ------------------ //

const scriptName = path.basename(__filename);
const fileNames = fs.readdirSync('./');
const renameList = [];
let totalAmount = 0;
let amountUnaltered = 0;

// Compute changes
fileNames.forEach(name => {

    if (name === scriptName || name === args[0] || name === args[0] + ".js") {
        say(chalk.green(`Skipping file: ${name}.`));
        return;
    }

    const isDirectory = fs.lstatSync(name).isDirectory();

    const renamed = renamingFunction(name, isDirectory);

    if (typeof renamed !== "string") {
        errorDontWorryExit(`The Renaming Function returned non-string for the input "${name}"!`);
    }
    if (renamed.length === 0) {
        errorDontWorryExit(`The Renaming Function returned empty string for the input "${name}"!`);
    }

    renameList.push({
        old: name,
        new: renamed
    });

    totalAmount++;
    if (name === renamed) amountUnaltered++;

});

// ------------------ DO THE MAGIC ------------------ //

if (amountUnaltered > 0) {
    say(chalk.green("Unaltered files:"));
    renameList.filter(rename => rename.old === rename.new).forEach(rename => {
        console.log(`    ${rename.old}`);
    });
}
if (totalAmount > amountUnaltered) {
    say(chalk.yellow(force ? "Altered files:" : "Files to be altered:") + "\n");
    renameList.filter(rename => rename.old !== rename.new).forEach(rename => {
        if (force) fs.renameSync(rename.old, rename.new);
        console.log(`    "${rename.old}" -> "${rename.new}".`);
    });
}

// ------------------ COMMAND SUMMARY ------------------ //

if (force) {
    say(chalk.blue(`Finished renaming.`));
    console.log(`\n    Total files: ${totalAmount}.`);
    console.log(`    Altered files: ${totalAmount - amountUnaltered}.`);
    console.log(`    Unaltered files: ${amountUnaltered}.`);
} else {
    say(chalk.blue(`Preview finished.`));
    console.log(`\n    Total files: ${totalAmount}.`);
    console.log(`    Files to be altered: ${totalAmount - amountUnaltered}.`);
    console.log(`    Files that will remain the same: ${amountUnaltered}.`);
}

// ----------------------------------------------------- //