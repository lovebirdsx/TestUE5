"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderJumpTalkId = void 0;
const React = require("react");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const ShowTalk_1 = require("../../Scheme/Action/ShowTalk");
// eslint-disable-next-line @typescript-eslint/naming-convention
function RenderJumpTalkId(props) {
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
}
exports.RenderJumpTalkId = RenderJumpTalkId;
//# sourceMappingURL=JumpTalk.js.map