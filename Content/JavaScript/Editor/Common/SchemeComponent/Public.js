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
const Flow_1 = require("../Scheme/Action/Flow");
const JumpTalk_1 = require("../Scheme/Action/JumpTalk");
const Sequence_1 = require("../Scheme/Action/Sequence");
const ShowTalk_1 = require("../Scheme/Action/ShowTalk");
const ShowText_1 = require("../Scheme/Action/ShowText");
const State_1 = require("../Scheme/Action/State");
const CsvCell_1 = require("../Scheme/Csv/CsvCell");
const NpcScheme_1 = require("../Scheme/Entity/NpcScheme");
const TriggerScheme_1 = require("../Scheme/Entity/TriggerScheme");
const Csv_1 = require("./Extend/Csv");
const Flow_2 = require("./Extend/Flow");
const Sequence_2 = require("./Extend/Sequence");
const Talk_1 = require("./Extend/Talk");
const RenderRegistry_1 = require("./RenderRegistry");
RenderRegistry_1.renderRegistry.RegComponent(JumpTalk_1.jumpIdScheme, Talk_1.RenderJumpTalkId);
RenderRegistry_1.renderRegistry.RegComponent(State_1.stateIdScheme, Flow_2.RenderStateId);
RenderRegistry_1.renderRegistry.RegComponent(ShowTalk_1.talkOptionTextIdScheme, Talk_1.RenderTextId);
RenderRegistry_1.renderRegistry.RegComponent(ShowTalk_1.talkItemTextIdScheme, Talk_1.RenderTextId);
RenderRegistry_1.renderRegistry.RegComponent(ShowText_1.centerTextIdScheme, Talk_1.RenderTextId);
RenderRegistry_1.renderRegistry.RegComponent(ShowTalk_1.talkerIdScheme, Talk_1.RenderTalkerIdScheme);
RenderRegistry_1.renderRegistry.RegComponent(ShowTalk_1.talkItemNameScheme, Talk_1.RenderTalkItemName);
RenderRegistry_1.renderRegistry.RegComponent(CsvCell_1.csvFollowCellScheme, Csv_1.RenderCsvFollowCell);
RenderRegistry_1.renderRegistry.RegComponent(NpcScheme_1.playFlowJsonScheme, Flow_2.RenderPlayFlowJson);
RenderRegistry_1.renderRegistry.RegComponent(TriggerScheme_1.actionsJsonScheme, Flow_2.RenderActionJson);
RenderRegistry_1.renderRegistry.RegObjComponent(ShowTalk_1.showTalkScheme, Talk_1.RenderShowTalk);
RenderRegistry_1.renderRegistry.RegComponent(Flow_1.playFlowScheme, Flow_2.RenderPlayFlow);
RenderRegistry_1.renderRegistry.RegComponent(Sequence_1.whoIdsScheme, Sequence_2.RenderWhoIdsScheme);
__exportStar(require("./Basic/Public"), exports);
//# sourceMappingURL=Public.js.map