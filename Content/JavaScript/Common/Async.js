"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
async function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.delay = delay;
//# sourceMappingURL=Async.js.map