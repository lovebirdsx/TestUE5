"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EBlueprintId = void 0;
const Class_1 = require("../../Common/Class");
const EntityRegistry_1 = require("./EntityRegistry");
const TsEntity_1 = require("./TsEntity");
const TsNpc_1 = require("./TsNpc");
const TsTrigger_1 = require("./TsTrigger");
EntityRegistry_1.entityRegistry.Register(TsEntity_1.default, ...TsEntity_1.entityComponentClasses);
EntityRegistry_1.entityRegistry.Register(TsNpc_1.default, ...TsNpc_1.npcComponentClasses);
EntityRegistry_1.entityRegistry.Register(TsTrigger_1.default, ...TsTrigger_1.triggerComponentClasses);
var EBlueprintId;
(function (EBlueprintId) {
    EBlueprintId[EBlueprintId["Entity"] = 0] = "Entity";
    EBlueprintId[EBlueprintId["Npc"] = 1] = "Npc";
    EBlueprintId[EBlueprintId["Trigger"] = 2] = "Trigger";
})(EBlueprintId = exports.EBlueprintId || (exports.EBlueprintId = {}));
function makeTsClassPath(basePath, name, dir) {
    if (dir) {
        return `${basePath}${dir}/${name}.${name}_C`;
    }
    return `${basePath}${name}.${name}_C`;
}
const ENTITY_BASE_PATH = '/Game/Blueprints/TypeScript/Game/Entity/';
function regEntity(id, tsClass, dir) {
    const path = makeTsClassPath(ENTITY_BASE_PATH, tsClass.name, dir);
    (0, Class_1.regBlueprintType)(id, path, tsClass);
}
regEntity(EBlueprintId.Entity, TsEntity_1.default);
regEntity(EBlueprintId.Npc, TsNpc_1.default);
regEntity(EBlueprintId.Trigger, TsTrigger_1.default);
__exportStar(require("./EntityRegistry"), exports);
__exportStar(require("./TsEntity"), exports);
__exportStar(require("./TsNpc"), exports);
__exportStar(require("./TsTrigger"), exports);
//# sourceMappingURL=Public.js.map