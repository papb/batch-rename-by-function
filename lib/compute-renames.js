"use strict";

const jetpack = require("fs-jetpack");
const print = require("./print");
const join = require("./join");
const stringify = x => JSON.stringify(x, null, 2);

/**
 * Compute renames for the given folder recursively.
 * 
 * @param {string} folderPath The path to the folder
 * 
 * @param {function} renamer The renamer function
 * 
 * @param {number} [maxDepth=0] The maximum depth to be recursively searched.
 * Defaults to 0, meaning that folders are not checked recursively.
 * 
 * @param {string} [fileNameToBeIgnoredInTheFirstDepth] If provided, a file with this name
 * will be ignored on the first depth of the search.
 * 
 * @return {Map} A map whose keys are all file names of the files
 * in the given folder (including nested folders) and the values are:
 * 
 * * For files: a string with the corresponding new (renamed) file name.
 * * For folders: an object `{ newName, recursiveCallResult }` where `newName` contains
 * the the folder's new (renamed) name, and recursiveCallResult is an empty map if the current depth
 * is the max depth, otherwise is the result of a recursive call of this function on that folder.
 * 
 * This map also contain two properties: `totalAmount`, which contains the
 * amount of files (including folders) recursively present in this folder; and
 * `amountUnaltered`, which is the amount of files whose new name is equal to
 * the old name (including nested files and folders).
 */
module.exports = function computeRenames(renamer, maxDepth, fileNameToBeIgnoredInTheFirstDepth) {
    return computeRenamesHelper(0, "", renamer, maxDepth, fileNameToBeIgnoredInTheFirstDepth);
};

function computeRenamesHelper(currentDepth, folderPath, renamer, maxDepth, fileNameToBeIgnoredInTheFirstDepth) {
    const fileNames = jetpack.list(folderPath);
    const renamingMap = new Map();
    renamingMap.totalAmount = 0;
    renamingMap.amountUnaltered = 0;

    for (const name of fileNames) {

        if (currentDepth === 0 && name === fileNameToBeIgnoredInTheFirstDepth) {
            print(`Skipping file: ${join(folderPath, name)}.`, "green");
            continue;
        }

        const isDirectory = jetpack.exists(join(folderPath, name)) === "dir";
        const data = {
            isDirectory: isDirectory,
            depth: currentDepth,
            parentFolder: folderPath || "."
        };
        let renamed = renamer(name, data);
        if (renamed === null || renamed === undefined) renamed = name;

        if (typeof renamed !== "string") {
            print.errorDontWorryExit(`The renaming function returned non-string for "${name}"! Data: ${stringify(data)}`);
        }
        if (renamed.length === 0) {
            print.errorDontWorryExit(`The renaming function returned empty string for "${name}"! Data: ${stringify(data)}`);
        }

        renamingMap.totalAmount++;
        if (name === renamed) renamingMap.amountUnaltered++;

        if (isDirectory) {
            if (currentDepth === maxDepth) {
                const map = new Map();
                map.totalAmount = 0;
                map.amountUnaltered = 0;
                renamingMap.set(name, {
                    newName: renamed,
                    recursiveCallResult: map
                });
            } else {
                const recursiveCallResult = computeRenamesHelper(currentDepth + 1, join(folderPath, name), renamer, maxDepth);
                renamingMap.set(name, {
                    newName: renamed,
                    recursiveCallResult
                });
                renamingMap.totalAmount += recursiveCallResult.totalAmount;
                renamingMap.amountUnaltered += recursiveCallResult.amountUnaltered;
            }
        } else {
            renamingMap.set(name, renamed);
        }

    }

    return renamingMap;
}