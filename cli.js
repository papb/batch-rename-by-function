#!/usr/bin/env node
const [,,...args] = process.argv;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const USAGE_TEXT = `    Usage
    
        $ rename-all <js-file-which-exports-the-renaming-function>

    Options
    
        --force, -F  Perform the actual renaming (without it, just a test is made)

    Examples
    
        $ rename-all myRename.js
        $ rename-all -F myRename.js`;

// ------------------ PARSE ARGS ------------------ //

if (!args.length) {
	console.log(USAGE_TEXT);
	return;
}

if (args.length > 2) {
	console.log(chalk.red("\nError: Too many args.\n"));
	console.log(USAGE_TEXT);
	return;
}

var renamingFunction = undefined;
var arg = undefined;
var testingOnly = true;

if (args.length === 1) {
	arg = args[0];
} else if (args[0] === "--force" || args[0] === "-F") {
	arg = args[1];
	testingOnly = false;
} else if (args[1] === "--force" || args[1] === "-F") {
	arg = args[0];
	testingOnly = false;
} else if (args.length == 2) {
	console.log(chalk.red("\nError: Unable to parse args.\n"));
	console.log(USAGE_TEXT);
	return;
}

try {
	renamingFunction = require("./" + args[0]);
} catch (e) {
	console.log(chalk.red(`\nError: Unable to require(${"./" + args[0]}).\n`));
	return;
}

if (typeof renamingFunction !== "function") {
	console.log(chalk.red("\nError: That file was found and processed by NodeJS but did not export a function.\n"));
	return;
}

// ------------------ EXPLAIN ------------------ //

if (testingOnly) {
	console.log("\n========== TESTING ONLY ==========\n");
} else {
	console.log("\n========== RENAMING! ==========\n");
}
console.log("Reminder: folders themselves are included in the process!\n");

// ------------------ READ THINGS ------------------ //

const scriptName = path.basename(__filename);
const fileNames = fs.readdirSync('./');
const renameList = [];
var totalAmount = 0;
var amountUntouched = 0;

// Compute changes
fileNames.forEach(name => {

	if (name === scriptName || name === args[0] || name === args[0] + ".js") {
		console.log(`Skipping file "${name}".`);
		return;
	}

	var renamed = renamingFunction(name);

	if (typeof renamed !== "string") {
		throw new Error(`Renaming Function returned non-string for the input "${name}"!`);
	}
	if (renamed.length === 0) {
		throw new Error(`Renaming Function returned empty string for the input "${name}"!`);
	}

	renameList.push({
		old: name,
		new: renamed
	});

	totalAmount++;
	if (name === renamed) amountUntouched++;

});

// ------------------ DO THE MAGIC ------------------ //

// Apply or simulate changes
renameList.forEach(rename => {
	if (rename.old === rename.new) {
		console.log(`UNTOUCHED: "${rename.old}".`);
	} else {
		if (!testingOnly) {
			fs.renameSync(rename.old, rename.new);
		}
		console.log(`ALTERED:   "${rename.old}" -> "${rename.new}".`);
	}
});

if (testingOnly) {
	console.log(`\nTest finished.`);
} else {
	console.log(`\nRenaming finished.`);
}
console.log(`Total files: ${totalAmount}.`);
console.log(`Altered files: ${totalAmount - amountUntouched}.`);
console.log(`Untouched files: ${amountUntouched}.`);