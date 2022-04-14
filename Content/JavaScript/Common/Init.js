"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalInit = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-param-reassign */
function at(n) {
    n = Math.trunc(n) || 0;
    if (n < 0) {
        n += this.length;
    }
    if (n < 0 || n >= this.length) {
        return undefined;
    }
    return this[n];
}
function globalInit() {
    for (const c of [Array, String]) {
        Object.defineProperty(c.prototype, 'at', {
            value: at,
            writable: true,
            enumerable: false,
            configurable: true,
        });
    }
}
exports.globalInit = globalInit;
//# sourceMappingURL=Init.js.map