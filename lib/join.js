"use strict";

module.exports = function join(folderPath, file) {
    return folderPath !== "" && folderPath !== "." ? `${folderPath}/${file}` : file;
};