const FNV_PRIME_32 = 16777619;
const HASH_MASK = 0xffffffff;

export class FnvHash {
    public static FnvHash32(s: string): number {
        let offsetBase = 0;
        const l = s.length;
        for (let i = 0; i < l; i++) {
            offsetBase = offsetBase ^ s.charCodeAt(i);
            offsetBase = (offsetBase * FNV_PRIME_32) & HASH_MASK;
        }
        return offsetBase;
    }
}
