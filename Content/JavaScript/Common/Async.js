"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitCallback = exports.delay = void 0;
async function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.delay = delay;
async function waitCallback(setCallback) {
    return new Promise((resolve1, reject1) => {
        setCallback(resolve1, reject1);
    });
}
exports.waitCallback = waitCallback;
//# sourceMappingURL=Async.js.map