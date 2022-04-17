"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.log = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
function log(msg) {
    ue_1.MyLog.Log(`${getTime()}: ${msg}`);
}
exports.log = log;
function warn(msg) {
    ue_1.MyLog.Warn(`${getTime()}: ${msg}`);
}
exports.warn = warn;
function error(msg) {
    ue_1.MyLog.Error(`${getTime()}: ${msg}`);
}
exports.error = error;
//# sourceMappingURL=Log.js.map