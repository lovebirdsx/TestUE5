"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityRegistry = exports.isEntity = void 0;
const Class_1 = require("../../Common/Class");
const Log_1 = require("../../Common/Log");
const TsPlayer_1 = require("../Player/TsPlayer");
const TsEntity_1 = require("./TsEntity");
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
function isEntity(actor) {
    return (0, Class_1.isChildOfClass)(actor, TsEntity_1.default) || (0, Class_1.isChildOfClass)(actor, TsPlayer_1.default);
}
exports.isEntity = isEntity;
exports.entityRegistry = new EntityRegistry();
//# sourceMappingURL=EntityRegistry.js.map