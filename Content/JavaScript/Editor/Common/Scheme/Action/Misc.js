"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitScheme = exports.showMssageScheme = exports.logScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Action_1 = require("../../../../Game/Flow/Action");
const Type_1 = require("../Type");
exports.logScheme = (0, Type_1.createObjectScheme)({
    Level: (0, Type_1.createEnumType)(Action_1.logLeveConfig, {
        Meta: {
            HideName: true,
        },
    }),
    Content: (0, Type_1.createStringScheme)({
        Meta: {
            HideName: true,
            Width: 300,
            Tip: '内容',
        },
        CreateDefault: () => 'Hello World',
    }),
}, {
    Meta: {
        Tip: '向控制台输出消息',
    },
});
exports.showMssageScheme = (0, Type_1.createObjectScheme)({
    Content: (0, Type_1.createStringScheme)({
        CreateDefault: () => 'Hello Message',
        Meta: {
            HideName: true,
            Width: 300,
            Tip: '内容',
        },
    }),
}, {
    Meta: {
        Tip: '在屏幕上显示消息',
    },
});
exports.waitScheme = (0, Type_1.createObjectScheme)({
    Time: (0, Type_1.createFloatScheme)({
        CreateDefault: () => 0.5,
        Meta: {
            HideName: true,
            Tip: '等待时长，单位秒',
        },
    }),
}, {
    Meta: {
        Tip: '等待一段时间',
    },
});
//# sourceMappingURL=Misc.js.map