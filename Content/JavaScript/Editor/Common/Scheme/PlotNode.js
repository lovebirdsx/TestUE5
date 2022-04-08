"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPlotModeScheme = exports.setCameraModeScheme = exports.setFlowBoolOptionScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Action_1 = require("../../../Game/Flow/Action");
const Type_1 = require("./Type");
exports.setFlowBoolOptionScheme = (0, Type_1.createObjectScheme)({
    Option: (0, Type_1.createEnumType)(Action_1.flowBoolOptionConfig, {
        Meta: {
            HideName: true,
        },
    }),
    Value: Type_1.booleanHideNameScheme,
}, {
    Meta: {
        Tip: '设定和剧情播放相关的控制变量',
    },
});
exports.setCameraModeScheme = (0, Type_1.createObjectScheme)({
    Mode: (0, Type_1.createEnumType)(Action_1.cameraModeConfig, {
        Meta: {
            HideName: true,
        },
    }),
}, {
    Meta: {
        Tip: '设定镜头模式',
    },
});
exports.setPlotModeScheme = (0, Type_1.createObjectScheme)({
    Mode: (0, Type_1.createEnumType)(Action_1.plotModeConfig, {
        Meta: {
            HideName: true,
        },
    }),
}, {
    Filters: ['normal'],
    Meta: {
        Tip: '设定剧情模式,默认为D级演出',
    },
});
//# sourceMappingURL=PlotNode.js.map