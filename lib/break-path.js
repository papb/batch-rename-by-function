"use strict";

module.exports = function breakPath(path) {
    const index = path.lastIndexOf('/');
    const folder = path.substring(0, index);
    const file = path.substring(index + 1);
    return { folder, file };
};