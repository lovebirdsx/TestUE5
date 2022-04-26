"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genGuid = exports.loadClass = exports.getFieldCount = exports.calHash = exports.deepEqualsIgnore = exports.deepEquals = exports.getEnumNames = exports.getEnumValues = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const UE = require("ue");
/* eslint-disable spellcheck/spell-checker */
function getEnumValues(enumType) {
    const valueNames = Object.keys(enumType).filter((item) => !Number.isNaN(Number(item)));
    return valueNames.map((name) => Number(name));
}
exports.getEnumValues = getEnumValues;
function getEnumNames(enumType) {
    const names = Object.keys(enumType).filter((item) => Number.isNaN(Number(item)));
    return names;
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
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    if (hash < 0) {
        hash = -hash;
    }
    return hash;
}
exports.calHash = calHash;
function getFieldCount(obj) {
    let count = 0;
    for (const key in obj) {
        if (key) {
            count++;
        }
    }
    return count;
}
exports.getFieldCount = getFieldCount;
function loadClass(classNameOrPath) {
    if (classNameOrPath.includes('/')) {
        return ue_1.Class.Load(classNameOrPath);
    }
    const tsClassObj = UE[classNameOrPath];
    return tsClassObj.StaticClass();
}
exports.loadClass = loadClass;
function genGuid() {
    return ue_1.KismetGuidLibrary.NewGuid().ToString();
}
exports.genGuid = genGuid;
//# sourceMappingURL=Util.js.map