"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishTalkScheme = exports.jumpTalkScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const Type_1 = require("../../../../Common/Type");
const CommonComponent_1 = require("../../ReactComponent/CommonComponent");
const ShowTalk_1 = require("./ShowTalk");
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
                const talkId = props.Value;
                const selected = items.find((e) => e.Id === talkId);
                const selectedName = selected ? selected.Name : '';
                return (React.createElement(CommonComponent_1.List, { Items: items.map((e) => e.Name), Selected: selectedName, OnSelectChanged: (itemName) => {
                        const item = items.find((it) => it.Name === itemName);
                        props.OnModify(item ? item.Id : 0, 'normal');
                    } }));
            }));
        },
    }),
}, {
    Filters: [Type_1.EObjectFilter.Talk],
    Meta: {
        Tip: '跳转到当前状态的对话,跳转后,将继续播放对应的对话',
    },
});
exports.finishTalkScheme = (0, Type_1.createObjectScheme)({}, {
    Filters: [Type_1.EObjectFilter.Talk],
    Meta: {
        Tip: '结束当前对话,跳到ShowTalk之后的动作执行',
    },
});
//# sourceMappingURL=JumpTalk.js.map