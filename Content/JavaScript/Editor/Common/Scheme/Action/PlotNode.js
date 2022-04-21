"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPlotModeScheme = exports.PlotModeScheme = exports.setCameraModeScheme = exports.CameraModeScheme = exports.setFlowBoolOptionScheme = exports.FlowBooleanOptionScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
const Util_1 = require("../../../../Common/Util");
const Action_1 = require("../../../../Game/Flow/Action");
class FlowBooleanOptionScheme extends Type_1.EnumScheme {
    Config = Action_1.flowBoolOptionConfig;
    Names = (0, Util_1.getEnumNamesByConfig)(Action_1.flowBoolOptionConfig);
}
exports.FlowBooleanOptionScheme = FlowBooleanOptionScheme;
exports.setFlowBoolOptionScheme = (0, Type_1.createObjectScheme)({
    Option: new FlowBooleanOptionScheme(),
    Value: Type_1.booleanHideNameScheme,
}, {
    Meta: {
        Tip: '设定和剧情播放相关的控制变量',
    },
    Filters: (0, Type_1.actionFilterExcept)(Type_1.EActionFilter.Trigger),
});
class CameraModeScheme extends Type_1.EnumScheme {
    Config = Action_1.cameraModeConfig;
    Names = (0, Util_1.getEnumNamesByConfig)(Action_1.cameraModeConfig);
}
exports.CameraModeScheme = CameraModeScheme;
exports.setCameraModeScheme = (0, Type_1.createObjectScheme)({
    Mode: new CameraModeScheme(),
}, {
    Meta: {
        Tip: '设定镜头模式',
    },
});
class PlotModeScheme extends Type_1.EnumScheme {
    Config = Action_1.plotModeConfig;
    Names = (0, Util_1.getEnumNamesByConfig)(Action_1.plotModeConfig);
}
exports.PlotModeScheme = PlotModeScheme;
exports.setPlotModeScheme = (0, Type_1.createObjectScheme)({
    Mode: new PlotModeScheme(),
}, {
    Filters: [Type_1.EActionFilter.FlowList],
    Meta: {
        Tip: '设定剧情模式,默认为D级演出',
    },
});
//# sourceMappingURL=PlotNode.js.map