"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileNameWithOutExt = exports.removeExtension = exports.getDir = exports.getFileName = void 0;
function getFileName(path) {
    // eslint-disable-next-line no-useless-escape
    return path.replace(/^.*[\\\/]/, '');
}
exports.getFileName = getFileName;
function getDir(path) {
    let lastSepPosition = path.lastIndexOf('/');
    if (lastSepPosition === -1) {
        lastSepPosition = path.lastIndexOf('\\');
    }
    if (lastSepPosition === -1) {
        return '';
    }
    return path.slice(0, lastSepPosition);
}
exports.getDir = getDir;
function removeExtension(filename) {
    const lastDotPosition = filename.lastIndexOf('.');
    if (lastDotPosition === -1) {
        return filename;
    }
    return filename.slice(0, lastDotPosition);
}
exports.removeExtension = removeExtension;
function getFileNameWithOutExt(path) {
    return removeExtension(getFileName(path));
}
exports.getFileNameWithOutExt = getFileNameWithOutExt;
//# sourceMappingURL=File.js.map