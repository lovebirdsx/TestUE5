"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderTalkerIdScheme = exports.RenderTalkItemName = exports.RenderShowTalk = exports.RenderTextId = exports.RenderJumpTalkId = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const React = require("react");
const react_umg_1 = require("react-umg");
const FlowList_1 = require("../../../../Game/Common/Operations/FlowList");
const TalkerList_1 = require("../../../../Game/Common/Operations/TalkerList");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const FilterableList_1 = require("../../BaseComponent/FilterableList");
const Public_1 = require("../Basic/Public");
const Context_1 = require("../Context");
function RenderJumpTalkId(props) {
    return (React.createElement(Context_1.showTalkContext.Consumer, null, (value) => {
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
function RenderTextId(props) {
    return (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.EditorBox, { Width: props.Scheme.Width, Text: FlowList_1.flowListContext.Get().Texts[props.Value], OnChange: (text) => {
                FlowList_1.flowListContext.Modify(FlowList_1.EFlowListAction.ModifyText, (from, to) => {
                    const textId = props.Value;
                    FlowList_1.flowListOp.ModifyText(to, textId, text);
                });
            }, Tip: props.Scheme.Tip })));
}
exports.RenderTextId = RenderTextId;
function RenderShowTalk(props) {
    return (React.createElement(Context_1.showTalkContext.Provider, { value: props.Value },
        React.createElement(Public_1.Obj, { ...props })));
}
exports.RenderShowTalk = RenderShowTalk;
function hasTalk(showTalk, name) {
    let count = 0;
    showTalk.TalkItems.forEach((item) => {
        if (item.Name === name) {
            count++;
        }
    });
    return count > 1;
}
function RenderTalkItemName(props) {
    return (React.createElement(Context_1.showTalkContext.Consumer, null, (value) => {
        return (React.createElement(Public_1.String, { ...props, Color: hasTalk(value, props.Value) ? '#FF0000 red' : CommonComponent_1.DEFAULT_EDIT_TEXT_COLOR }));
    }));
}
exports.RenderTalkItemName = RenderTalkItemName;
function RenderTalkerIdScheme(props) {
    const { Talkers: talkers } = TalkerList_1.TalkerListOp.Get();
    const names = TalkerList_1.TalkerListOp.GetNames();
    const selectedTalker = talkers.find((e) => e.Id === props.Value);
    return (React.createElement(FilterableList_1.FilterableList, { Items: names, Selected: selectedTalker ? selectedTalker.Name : '', Tip: props.Scheme.Tip, OnSelectChanged: (name) => {
            const who = talkers.find((e) => e.Name === name);
            props.OnModify(who.Id, 'normal');
        } }));
}
exports.RenderTalkerIdScheme = RenderTalkerIdScheme;
//# sourceMappingURL=Talk.js.map