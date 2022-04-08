"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jumpTalkScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const CommonComponent_1 = require("../Component/CommonComponent");
const ShowTalk_1 = require("./ShowTalk");
const Type_1 = require("./Type");
exports.jumpTalkScheme = (0, Type_1.createObjectScheme)({
    TalkId: (0, Type_1.createIntScheme)({
        Meta: {
            HideName: true,
        },
        CreateDefault() {
            return 0;
        },
        Render(props) {
            return (React.createElement(ShowTalk_1.showTalkContext.Consumer, null, (value) => {
                const showTalk = value;
                const items = showTalk.TalkItems;
                const slected = items[props.Value].Name;
                return (React.createElement(CommonComponent_1.List, { Items: items.map((e) => e.Name), Selected: slected, OnSelectChanged: (itemName) => {
                        props.OnModify(items.findIndex((it) => it.Name === itemName));
                    } }));
            }));
        },
    }),
}, {
    Filters: ['talk'],
    Meta: {
        Tip: '跳转到当前状态的对话,跳转后,将继续播放对应的对话',
    },
});
//# sourceMappingURL=JumpTalk.js.map