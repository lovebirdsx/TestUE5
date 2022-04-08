"use strict";
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDirOfFile = exports.calHash = exports.deepEqualsIgnore = exports.deepEquals = exports.getEnumNames = void 0;
const ue_1 = require("ue");
/* eslint-disable spellcheck/spell-checker */
function getEnumNames(e) {
    return Object.keys(e).filter((v) => Number.isNaN(parseInt(v, 10)));
}
exports.getEnumNames = getEnumNames;
function deepEquals(x, y) {
    if (x === y) {
        return true;
    }
    const typeX = typeof x;
    const typeY = typeof y;
    if (typeX !== typeY) {
        return false;
    }
    if (typeX !== 'object' || x === null || y === null) {
        return false;
    }
    for (const p in x) {
        if (!deepEquals(x[p], y[p])) {
            return false;
        }
    }
    for (const p in y) {
        if (x[p] === undefined) {
            return false;
        }
    }
    return true;
}
exports.deepEquals = deepEquals;
function deepEqualsIgnore(x, y, ignoreFields) {
    if (x === y) {
        return true;
    }
    const typeX = typeof x;
    const typeY = typeof y;
    if (typeX !== typeY) {
        return false;
    }
    if (typeX !== 'object' || x === null || y === null) {
        return false;
    }
    for (const p in x) {
        if (ignoreFields.includes(p)) {
            continue;
        }
        if (!deepEqualsIgnore(x[p], y[p], ignoreFields)) {
            return false;
        }
    }
    for (const p in y) {
        if (ignoreFields.includes(p)) {
            continue;
        }
        if (x[p] === undefined) {
            return false;
        }
    }
    return true;
}
exports.deepEqualsIgnore = deepEqualsIgnore;
function calHash(str) {
    let hash = 0;
    const length = str.length;
    if (length === 0) {
        return hash;
    }
    for (let i = 0; i < length; i++) {
        const chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
exports.calHash = calHash;
function openDirOfFile(filepath) {
    const command = [
        'import os',
        `path = os.path.normpath('${filepath}')`,
        `os.system(r'explorer /select, "{path}"'.format(path=path))`,
    ].join('\r\n');
    ue_1.PythonScriptLibrary.ExecutePythonCommand(command);
}
exports.openDirOfFile = openDirOfFile;
//# sourceMappingURL=Util.js.map