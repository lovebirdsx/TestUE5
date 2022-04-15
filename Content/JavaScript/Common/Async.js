"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitCallback = exports.delayByCondition = exports.delay = exports.MS_PER_SEC = void 0;
exports.MS_PER_SEC = 1000;
/* eslint-disable spellcheck/spell-checker */
async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time * exports.MS_PER_SEC);
    });
}
exports.delay = delay;
async function delayByCondition(time, condtion) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (condtion()) {
                resolve();
            }
        }, time * exports.MS_PER_SEC);
    });
}
exports.delayByCondition = delayByCondition;
async function waitCallback(setCallback) {
    return new Promise((resolve1, reject1) => {
        setCallback(resolve1, reject1);
    });
}
exports.waitCallback = waitCallback;
//# sourceMappingURL=Async.js.map