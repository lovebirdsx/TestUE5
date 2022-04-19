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
const ActionRegistry_1 = require("./ActionRegistry");
const Flow_1 = require("./Flow");
const JumpTalk_1 = require("./JumpTalk");
const Misc_1 = require("./Misc");
const PlotNode_1 = require("./PlotNode");
const Sequence_1 = require("./Sequence");
const ShowTalk_1 = require("./ShowTalk");
const ShowText_1 = require("./ShowText");
const State_1 = require("./State");
const actionSchemeMap = {
    ChangeState: State_1.changeStateScheme,
    ChangeRandomState: State_1.changeRandomStateScheme,
    FinishTalk: JumpTalk_1.finishTalkScheme,
    FinishState: State_1.finishStateScheme,
    JumpTalk: JumpTalk_1.jumpTalkScheme,
    Log: Misc_1.logScheme,
    PlayFlow: Flow_1.playFlowScheme,
    PlaySequenceData: Sequence_1.playSequenceDataScheme,
    PlayCustomSequence: Sequence_1.playCustomSequenceScheme,
    SetCameraMode: PlotNode_1.setCameraModeScheme,
    SetFlowBoolOption: PlotNode_1.setFlowBoolOptionScheme,
    SetPlotMode: PlotNode_1.setPlotModeScheme,
    ShowCenterText: ShowText_1.showCenterTextScheme,
    ShowMessage: Misc_1.showMssageScheme,
    ShowOption: ShowTalk_1.showOptionScheme,
    ShowTalk: ShowTalk_1.showTalkScheme,
    Wait: Misc_1.waitScheme,
};
ActionRegistry_1.actionRegistry.SetupActionMap(actionSchemeMap);
__exportStar(require("./ActionRegistry"), exports);
__exportStar(require("./Flow"), exports);
__exportStar(require("./Sequence"), exports);
//# sourceMappingURL=Public.js.map