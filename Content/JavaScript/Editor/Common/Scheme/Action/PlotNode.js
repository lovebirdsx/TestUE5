"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPlotModeScheme = exports.setCameraModeScheme = exports.setFlowBoolOptionScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("../../../../Game/Flow/Action");
exports.setFlowBoolOptionScheme = (0, Type_1.createObjectScheme)({
    // fuck
    // Option: createEnumType(flowBoolOptionConfig, {
    //     Meta: {
    //         HideName: true,
    //     },
    // }),
    Option: new Type_1.EnumScheme(Action_1.flowBoolOptionConfig),
    Value: Type_1.booleanHideNameScheme,
}, {
    Meta: {
        Tip: '设定和剧情播放相关的控制变量',
    },
    Filters: (0, Type_1.actionFilterExcept)(Type_1.EActionFilter.Trigger),
});
exports.setCameraModeScheme = (0, Type_1.createObjectScheme)({
    // fuck
    // Mode: createEnumType(cameraModeConfig, {
    //     Meta: {
    //         HideName: true,
    //     },
    // }),
    Mode: new Type_1.EnumScheme(Action_1.cameraModeConfig),
}, {
    Meta: {
        Tip: '设定镜头模式',
    },
});
exports.setPlotModeScheme = (0, Type_1.createObjectScheme)({
    // fuck
    // Mode: createEnumType(plotModeConfig, {
    //     Meta: {
    //         HideName: true,
    //     },
    // }),
    Mode: new Type_1.EnumScheme(Action_1.plotModeConfig),
}, {
    Filters: [Type_1.EActionFilter.FlowList],
    Meta: {
        Tip: '设定剧情模式,默认为D级演出',
    },
});
//# sourceMappingURL=PlotNode.js.map