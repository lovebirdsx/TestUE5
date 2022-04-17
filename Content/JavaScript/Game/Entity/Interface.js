"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseComponentsState = void 0;
function parseComponentsState(json) {
    if (!json) {
        return {
            Components: {},
        };
    }
    return JSON.parse(json);
}
exports.parseComponentsState = parseComponentsState;
//# sourceMappingURL=Interface.js.map