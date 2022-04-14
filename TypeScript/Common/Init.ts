/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-param-reassign */
function at<T>(n: number): T | undefined {
    n = Math.trunc(n) || 0;
    if (n < 0) {
        n += this.length;
    }
    if (n < 0 || n >= this.length) {
        return undefined;
    }
    return this[n];
}

export function globalInit(): void {
    for (const c of [Array, String]) {
        Object.defineProperty(c.prototype, 'at', {
            value: at,
            writable: true,
            enumerable: false,
            configurable: true,
        });
    }
}
