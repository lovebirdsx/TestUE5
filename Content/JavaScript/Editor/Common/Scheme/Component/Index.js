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
const Type_1 = require("../../../../Common/Type");
const ActionRunnerComponent_1 = require("../../../../Game/Component/ActionRunnerComponent");
const FlowComponent_1 = require("../../../../Game/Component/FlowComponent");
const TalkComponent_1 = require("../../../../Game/Component/TalkComponent");
const ComponentRegistry_1 = require("./ComponentRegistry");
const FlowComponentScheme_1 = require("./FlowComponentScheme");
ComponentRegistry_1.componentRegistry.RegisterClass(ActionRunnerComponent_1.ActionRunnerComponent, Type_1.emptyObjectScheme);
ComponentRegistry_1.componentRegistry.RegisterClass(FlowComponent_1.FlowComponent, FlowComponentScheme_1.flowComponentScheme);
ComponentRegistry_1.componentRegistry.RegisterClass(TalkComponent_1.TalkComponent, Type_1.emptyObjectScheme);
__exportStar(require("./ComponentRegistry"), exports);
__exportStar(require("./FlowComponentScheme"), exports);
//# sourceMappingURL=Index.js.map