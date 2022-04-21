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
const Type_1 = require("../../../Common/Type");
const JumpTalk_1 = require("../Scheme/Action/JumpTalk");
const Basic_1 = require("./Basic/Basic");
const Obj_1 = require("./Basic/Obj");
const RenderRegistry_1 = require("./RenderRegistry");
const JumpTalk_2 = require("./Talk/JumpTalk");
RenderRegistry_1.renderRegistry.RegComponent(Type_1.FloatScheme, Basic_1.Float);
RenderRegistry_1.renderRegistry.RegComponent(Type_1.BooleanScheme, Basic_1.Bool);
RenderRegistry_1.renderRegistry.RegComponent(Type_1.StringScheme, Basic_1.String);
RenderRegistry_1.renderRegistry.RegComponent(Type_1.IntScheme, Basic_1.Int);
RenderRegistry_1.renderRegistry.RegComponent(JumpTalk_1.JumpTalkIdScheme, JumpTalk_2.RenderJumpTalkId);
RenderRegistry_1.renderRegistry.RegObjComponent(JumpTalk_1.JumpTalkScheme, Obj_1.Obj);
__exportStar(require("./Basic/Public"), exports);
//# sourceMappingURL=Public.js.map