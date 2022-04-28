"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const FlowComponent_1 = require("../../Component/FlowComponent");
const ComponentRegistry_1 = require("./ComponentRegistry");
const FlowComponentScheme_1 = require("./FlowComponentScheme");
ComponentRegistry_1.componentRegistry.RegisterClass(FlowComponent_1.FlowComponent, FlowComponentScheme_1.flowComponentScheme);
__exportStar(require("./ComponentRegistry"), exports);
__exportStar(require("./FlowComponentScheme"), exports);
//# sourceMappingURL=Index.js.map