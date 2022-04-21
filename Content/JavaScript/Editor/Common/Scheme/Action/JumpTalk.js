"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishTalkScheme = exports.jumpTalkScheme = exports.jumpIdScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
exports.jumpIdScheme = (0, Type_1.createIntScheme)();
exports.jumpTalkScheme = (0, Type_1.createObjectScheme)({
    TalkId: exports.jumpIdScheme,
}, {
    Filters: [Type_1.EActionFilter.Talk],
    Tip: '跳转到当前状态的对话,跳转后,将继续播放对应的对话',
});
exports.finishTalkScheme = (0, Type_1.createObjectScheme)({}, {
    Filters: [Type_1.EActionFilter.Talk],
    Tip: '结束当前对话,跳到ShowTalk之后的动作执行',
});
//# sourceMappingURL=JumpTalk.js.map