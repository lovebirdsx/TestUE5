"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatColor = void 0;
function formatColor(color) {
    const num = parseInt(color.slice(1, 7), 16);
    const b = (num & 0xff) / 255;
    const g = ((num & 0xff00) >>> 8) / 255;
    const r = ((num & 0xff0000) >>> 16) / 255;
    return { R: r, G: g, B: b, A: 1 };
}
exports.formatColor = formatColor;
//# sourceMappingURL=Color.js.map