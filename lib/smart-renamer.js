"use strict";

const breakPath = require("./break-path");
const jetpack = require("fs-jetpack");
const renamer = require("./renamer");
const join = require("./join");

const renameHistory = [];

const postponedRenames = [];

function postponeRename(originalPath, newPath) {
    postponedRenames.push([originalPath, newPath]);
}

function getAvailableTempName(folderPath) {
    const files = jetpack.list(folderPath);
    const makeRandomName = () => `${Math.random()}`;
    let name = makeRandomName();
    while (files.indexOf(name) !== -1) name = makeRandomName();
    return name;
}

function checkAvailability(originalPath, newPath) {
    const { file: newFileName, folder: folderPath } = breakPath(newPath);
    const alreadyExistingFileNames = jetpack.list(folderPath);
    return alreadyExistingFileNames.indexOf(newFileName) === -1;
}

const renameWithHistory = {
    sync(originalPath, newPath) {
        const available = checkAvailability(originalPath, newPath);
        if (available) {
            renamer.sync(originalPath, newPath);
            renameHistory.push([originalPath, newPath]);
        } else {
            const folder = breakPath(newPath).folder;
            const tempPath = join(folder, getAvailableTempName(folder));
            postponeRename(tempPath, newPath);
            renameWithHistory.sync(originalPath, tempPath);
        }
    },
    async(originalPath, newPath) {
        const available = checkAvailability(originalPath, newPath);
        if (available) {
            return renamer.async(originalPath, newPath).then(() => {
                renameHistory.push([originalPath, newPath]);
            });
        } else {
            const folder = breakPath(newPath).folder;
            const tempPath = join(folder, getAvailableTempName(folder));
            postponeRename(tempPath, newPath);
            return renameWithHistory.async(originalPath, tempPath);
        }
    }
};

module.exports = {
    sync: renameWithHistory.sync,
    async: renameWithHistory.async,
    executePostponedRenames: {
        sync() {
            for (const [originalPath, newPath] of postponedRenames) {
                renamer.sync(originalPath, newPath);
            }
        },
        async() {
            return Promise.mapSeries(postponedRenames, ([originalPath, newPath]) => {
                return renamer.async(originalPath, newPath);
            });
        }
    }
};