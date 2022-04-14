"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumNames = exports.getEnumValues = void 0;
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
//# sourceMappingURL=Util.js.map