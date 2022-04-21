"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentRegistry = void 0;
const Log_1 = require("../../../../Common/Log");
class ComponentRegistry {
    ComponentsMap = new Map();
    Register(type, componentClass) {
        if (this.ComponentsMap.get(type)) {
            (0, Log_1.error)(`Register duplicate component [${componentClass}] for ${type}`);
        }
        this.ComponentsMap.set(type, componentClass);
    }
    Get(type) {
        return this.ComponentsMap.get(type);
    }
}
exports.componentRegistry = new ComponentRegistry();
//# sourceMappingURL=ComponentRegistry.js.map