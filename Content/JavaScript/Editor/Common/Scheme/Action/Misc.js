"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitScheme = exports.showMssageScheme = exports.logScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("../../../../Game/Flow/Action");
exports.logScheme = (0, Type_1.createObjectScheme)({
    // fuck
    // Level: createEnumType(logLeveConfig, {
    //     Meta: {
    //         HideName: true,
    //     },
    // }) as Scheme<TLogLevel>,
    Level: new Type_1.EnumScheme(Action_1.logLeveConfig),
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
class TimeScheme extends Type_1.FloatScheme {
    CreateDefault() {
        return 0.5;
    }
    HideName = true;
    Tip = '等待时长，单位秒';
}
exports.waitScheme = (0, Type_1.createObjectScheme)({
    Time: new TimeScheme(),
}, {
    Meta: {
        Tip: '等待一段时间',
    },
});
//# sourceMappingURL=Misc.js.map