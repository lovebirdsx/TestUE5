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
/* eslint-disable spellcheck/spell-checker */
const Array_1 = require("./Array");
const Basic_1 = require("./Basic");
const ComponentRegistry_1 = require("./ComponentRegistry");
const Dynamic_1 = require("./Dynamic");
const Obj_1 = require("./Obj");
function initAllComponents() {
    ComponentRegistry_1.componentRegistry.Register('array', Array_1.Array);
    ComponentRegistry_1.componentRegistry.Register('object', Obj_1.Obj);
    ComponentRegistry_1.componentRegistry.Register('dynamic', Dynamic_1.Dynamic);
    ComponentRegistry_1.componentRegistry.Register('boolean', Basic_1.Bool);
    ComponentRegistry_1.componentRegistry.Register('int', Basic_1.Int);
    ComponentRegistry_1.componentRegistry.Register('float', Basic_1.Float);
    ComponentRegistry_1.componentRegistry.Register('string', Basic_1.String);
    ComponentRegistry_1.componentRegistry.Register('enum', Basic_1.Enum);
    ComponentRegistry_1.componentRegistry.Register('asset', Basic_1.Asset);
}
initAllComponents();
__exportStar(require("./Any"), exports);
__exportStar(require("./Array"), exports);
__exportStar(require("./Basic"), exports);
__exportStar(require("./Dynamic"), exports);
__exportStar(require("./Obj"), exports);
//# sourceMappingURL=Public.js.map