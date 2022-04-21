"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitScheme = exports.showMssageScheme = exports.LogScheme = exports.ContentScheme = exports.LogLevelScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
const Util_1 = require("../../../../Common/Util");
const Action_1 = require("../../../../Game/Flow/Action");
class LogLevelScheme extends Type_1.EnumScheme {
    Config = Action_1.logLeveConfig;
    Names = (0, Util_1.getEnumNamesByConfig)(Action_1.logLeveConfig);
}
exports.LogLevelScheme = LogLevelScheme;
const DEFAULT_CONTENT_LEN = 300;
class ContentScheme extends Type_1.StringScheme {
    CreateDefault() {
        return 'Hello World';
    }
    HideName = true;
    Width = DEFAULT_CONTENT_LEN;
    Tip = '内容';
}
exports.ContentScheme = ContentScheme;
class LogScheme extends Type_1.ObjectScheme {
    Fields = {
        Level: new LogLevelScheme(),
        Content: new ContentScheme(),
    };
    Tip = '向控制台输出消息';
}
exports.LogScheme = LogScheme;
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