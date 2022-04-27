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
const TsNpc_1 = require("../../Entity/TsNpc");
const TsTrigger_1 = require("../../Entity/TsTrigger");
const EntitySchemeRegistry_1 = require("./EntitySchemeRegistry");
const NpcScheme_1 = require("./NpcScheme");
const TriggerScheme_1 = require("./TriggerScheme");
EntitySchemeRegistry_1.entitySchemeRegistry.RegScheme(TsTrigger_1.default, TriggerScheme_1.triggerScheme);
EntitySchemeRegistry_1.entitySchemeRegistry.RegScheme(TsNpc_1.default, NpcScheme_1.npcScheme);
__exportStar(require("./EntitySchemeRegistry"), exports);
//# sourceMappingURL=Public.js.map