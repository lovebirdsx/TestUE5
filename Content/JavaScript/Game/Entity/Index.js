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
const Class_1 = require("../../Common/Class");
const ActionRunnerComponent_1 = require("../Component/ActionRunnerComponent");
const FlowComponent_1 = require("../Component/FlowComponent");
const TalkComponent_1 = require("../Component/TalkComponent");
const EntityRegistry_1 = require("./EntityRegistry");
const TsEntity_1 = require("./TsEntity");
const TsNpc_1 = require("./TsNpc");
const TsTrigger_1 = require("./TsTrigger");
EntityRegistry_1.entityRegistry.Register(TsEntity_1.default);
EntityRegistry_1.entityRegistry.Register(TsNpc_1.default, FlowComponent_1.FlowComponent, TalkComponent_1.TalkComponent, ActionRunnerComponent_1.ActionRunnerComponent);
EntityRegistry_1.entityRegistry.Register(TsTrigger_1.default, ActionRunnerComponent_1.ActionRunnerComponent);
(0, Class_1.regBlueprintType)('/Game/Blueprints/TypeScript/Game/Entity/TsEntity.TsEntity_C', TsEntity_1.default);
(0, Class_1.regBlueprintType)('/Game/Blueprints/TypeScript/Game/Entity/TsNpc.TsNpc_C', TsNpc_1.default);
(0, Class_1.regBlueprintType)('/Game/Blueprints/TypeScript/Game/Entity/TsTrigger.TsTrigger_C', TsTrigger_1.default);
__exportStar(require("./EntityRegistry"), exports);
__exportStar(require("./TsEntity"), exports);
__exportStar(require("./TsNpc"), exports);
__exportStar(require("./TsTrigger"), exports);
//# sourceMappingURL=Index.js.map