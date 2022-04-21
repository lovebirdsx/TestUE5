"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRegistry = void 0;
class RenderRegistry {
    RenderClassMap = new Map();
    RegComponent(schemeClass, render) {
        this.RenderClassMap.set(schemeClass, render);
    }
    RegArrayComponent(scheme, render) {
        this.RegComponent(scheme, render);
    }
    RegObjComponent(scheme, render) {
        this.RegComponent(scheme, render);
    }
    RegActionComponent(scheme, render) {
        this.RegComponent(scheme, render);
    }
    GetComponent(scheme) {
        const result = this.RenderClassMap.get(scheme);
        return result;
    }
}
exports.renderRegistry = new RenderRegistry();
//# sourceMappingURL=RenderRegistry.js.map