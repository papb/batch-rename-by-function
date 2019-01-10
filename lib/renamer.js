"use strict";

const jetpack = require("fs-jetpack");
const print = require("./print");
const wait = millis => new Promise(resolve => setTimeout(resolve, millis));

function printRetryWarning(path, newName, error) {
    print(`Warning: retrying rename "${path}" -> "${newName}" due to error: ${error.message}`, "yellow");
}

function transformNewName([path, newName]) {
    const pathSlashIndex = path.lastIndexOf('/');
    const newNameSlashIndex = newName.lastIndexOf('/');
    if (path.substring(0, pathSlashIndex) !== newName.substring(0, newNameSlashIndex)) {
        throw new Error("Something is not right with batch-rename-by-function. Please report this bug.");
    }
    return newName.substring(newNameSlashIndex);
}

function modifiedRename(path, newName, maxRetries = 5) {
    const transformedNewName = transformNewName([path, newName]);
    for (let i = 1; i < maxRetries; i++) {
        try {
            jetpack.rename(path, transformedNewName);
            return;
        } catch (e) {
            printRetryWarning(path, newName, e);
        }
    }
    jetpack.rename(path, transformedNewName);
}

function modifiedRenameAsyncHelper(path, newName, transformedNewName, remainingRetries) {
    if (remainingRetries === 0) return jetpack.renameAsync(path, transformedNewName);
    return jetpack.renameAsync(path, transformedNewName).catch(e => {
        printRetryWarning(path, newName, e);
        return wait(500 + 500 * Math.random()).then(() => {
            return modifiedRenameAsyncHelper(path, newName, transformedNewName, remainingRetries - 1);
        });
    });
}

function modifiedRenameAsync(path, newName, maxRetries = 5) {
    const transformedNewName = transformNewName([path, newName]);
    return modifiedRenameAsyncHelper(path, newName, transformedNewName, maxRetries);
}

module.exports = {
    sync: modifiedRename,
    async: modifiedRenameAsync
};