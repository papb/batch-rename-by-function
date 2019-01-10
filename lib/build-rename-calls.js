"use strict";

const join = require("./join");

function pushToListInMap(map, key, value) {
    if (!map.has(key)) {
        map.set(key, [value]);
    } else {
        map.get(key).push(value);
    }
}

module.exports = function buildRenameCalls(renamingMap) {
    const renameCalls = [];
    renameCalls.conflicts = [];
    const sourcesOfResultingNames = new Map();
    for (const [key, value] of renamingMap) {
        if (typeof value === "string") {
            pushToListInMap(sourcesOfResultingNames, value, key);
            if (key !== value) {
                renameCalls.push([key, value]);
            }
        } else if (typeof value === "object") {
            const innerList = buildRenameCalls(value.recursiveCallResult);
            renameCalls.push(...innerList.map(([innerKey, innerValue]) => [
                join(key, innerKey),
                join(key, innerValue)
            ]));
            renameCalls.conflicts.push(...innerList.conflicts.map(conflict => ({
                targetName: join(value.newName, conflict.targetName),
                sourceNames: conflict.sourceNames.map(sourceName => join(key, sourceName))
            })));
            pushToListInMap(sourcesOfResultingNames, value.newName, key);
            if (key !== value.newName) {
                renameCalls.push([key, value.newName]);
            }
        }
    }
    for (const [targetName, sourceNames] of sourcesOfResultingNames) {
        if (sourceNames.length > 1) {
            renameCalls.conflicts.push({ targetName, sourceNames });
        }
    }
    return renameCalls;
};