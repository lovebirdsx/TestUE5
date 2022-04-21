"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRegistry = void 0;
class RenderRegistry {
    RenderClassMap = new Map();
    RegComponent(schemeClass, render) {
        this.RenderClassMap.set(schemeClass, render);
    }
    RegArrayComponent(schemeClass, render) {
        this.RegComponent(schemeClass, render);
    }
    RegObjComponent(schemeClass, render) {
        this.RegComponent(schemeClass, render);
    }
    RegActionComponent(schemeClass, render) {
        this.RegComponent(schemeClass, render);
    }
    GetComponent(schemeClass) {
        const result = this.RenderClassMap.get(schemeClass);
        return result;
    }
}
exports.renderRegistry = new RenderRegistry();
//# sourceMappingURL=RenderRegistry.js.map