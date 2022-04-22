"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitScheme = exports.showMssageScheme = exports.logScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("../../../../Game/Flow/Action");
exports.logScheme = (0, Type_1.createObjectScheme)({
    Name: 'Log',
    Fields: {
        Level: (0, Type_1.createEnumScheme)({
            Name: 'LogLeveConfig',
            Config: Action_1.logLeveConfig,
        }),
        Content: (0, Type_1.createStringScheme)({
            Width: 300,
            Tip: '内容',
            CreateDefault: () => 'Hello World',
        }),
    },
    Tip: '向控制台输出消息',
});
exports.showMssageScheme = (0, Type_1.createObjectScheme)({
    Name: 'ShowMessage',
    Fields: {
        Content: (0, Type_1.createStringScheme)({
            CreateDefault: () => 'Hello Message',
            Width: 300,
            Tip: '内容',
        }),
    },
    Tip: '在屏幕上显示消息',
});
exports.waitScheme = (0, Type_1.createObjectScheme)({
    Name: 'Wait',
    Fields: {
        Time: (0, Type_1.createIntScheme)({
            CreateDefault: () => 0.5,
            Tip: '等待时长，单位秒',
        }),
    },
    Tip: '等待一段时间',
});
//# sourceMappingURL=Misc.js.map