"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishTalkScheme = exports.JumpTalkScheme = exports.JumpTalkIdScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
class JumpTalkIdScheme extends Type_1.IntScheme {
}
exports.JumpTalkIdScheme = JumpTalkIdScheme;
class JumpTalkScheme extends Type_1.ObjectScheme {
    Fields = {
        TalkId: new JumpTalkIdScheme(),
    };
    Filters = [Type_1.EActionFilter.Talk];
    Tip = '跳转到当前状态的对话,跳转后,将继续播放对应的对话';
}
exports.JumpTalkScheme = JumpTalkScheme;
class FinishTalkScheme extends Type_1.ObjectScheme {
    Fields = {};
    Filters = [Type_1.EActionFilter.Talk];
    Tip = '结束当前对话,跳到ShowTalk之后的动作执行';
}
exports.FinishTalkScheme = FinishTalkScheme;
//# sourceMappingURL=JumpTalk.js.map