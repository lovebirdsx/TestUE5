"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityRegistry = void 0;
const Log_1 = require("../../Common/Log");
class EntityRegistry {
    EntityMap = new Map();
    Register(entityClass, ...components) {
        this.EntityMap.set(entityClass, components);
    }
    GetComponents(entityClass) {
        const result = this.EntityMap.get(entityClass);
        if (!result) {
            (0, Log_1.error)(`No components class for [${entityClass.name}]`);
        }
        return result;
    }
}
exports.entityRegistry = new EntityRegistry();
//# sourceMappingURL=EntityRegistry.js.map