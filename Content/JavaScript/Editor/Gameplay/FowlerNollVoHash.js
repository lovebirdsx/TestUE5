"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FnvHash = void 0;
const FNV_PRIME_32 = 16777619;
const HASH_MASK = 0xffffffff;
class FnvHash {
    static FnvHash32(s) {
        let offsetBase = 0;
        const l = s.length;
        for (let i = 0; i < l; i++) {
            offsetBase = offsetBase ^ s.charCodeAt(i);
            offsetBase = (offsetBase * FNV_PRIME_32) & HASH_MASK;
        }
        return offsetBase;
    }
}
exports.FnvHash = FnvHash;
//# sourceMappingURL=FowlerNollVoHash.js.map