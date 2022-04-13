"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const Test_1 = require("../../Editor/Common/Test");
const Util_1 = require("../../Editor/Common/Util");
const Flow_1 = require("../Common/Operations/Flow");
const FlowList_1 = require("../Common/Operations/FlowList");
const TalkListTool_1 = require("../../Editor/FlowEditor/TalkListTool");
const TalkerList_1 = require("../../Editor/TalkerEditor/TalkerList");
function flowListEqual(f1, f2) {
    return (0, Util_1.deepEqualsIgnore)(f1, f2, ['flowGenId', 'stateGenId']);
}
function createFlowList({ FlowCount: flowCount, StateCount: stateCount, TalkCount: talkCount, TalkItemCount: talkItemCount, OptionCount: optionCount, }) {
    const flowList = FlowList_1.flowListOp.Create();
    for (let i = 0; i < flowCount; i++) {
        const flow = FlowList_1.flowListOp.CreateFlow(flowList);
        flowList.FlowGenId++;
        flow.Name = `剧情${i + 1}`;
        for (let j = 0; j < stateCount; j++) {
            const state = Flow_1.flowOp.CreateState(flow);
            flow.StateGenId++;
            for (let k = 0; k < talkCount; k++) {
                const showTalk = {
                    TalkItems: [],
                };
                for (let i1 = 0; i1 < talkItemCount; i1++) {
                    const talkItem = {
                        Id: i1,
                        Name: `对话${i1}`,
                        WhoId: TalkerList_1.TalkerListOp.GetId(TalkerList_1.TalkerListOp.Get(), '小明'),
                        TextId: FlowList_1.flowListOp.CreateText(flowList, `对话内容${i1}`),
                    };
                    if (optionCount > 0) {
                        talkItem.Options = [];
                        for (let k1 = 0; k1 < optionCount; k1++) {
                            const option = {
                                TextId: FlowList_1.flowListOp.CreateText(flowList, `选项内容${i1}`),
                                Actions: [],
                            };
                            talkItem.Options.push(option);
                        }
                    }
                    showTalk.TalkItems.push(talkItem);
                }
                const action = {
                    Name: 'ShowTalk',
                    Params: showTalk,
                };
                state.Actions.push(action);
                // 若要加入多个talkItem,那么必须中间穿插 ShowOption类接口
                // 不然解析时会把所有的talkItem当成1个来处理
                if (talkCount > 1) {
                    const showOption = {
                        TextId: FlowList_1.flowListOp.CreateText(flowList, `独立选项内容${k}`),
                    };
                    state.Actions.push({
                        Name: 'ShowOption',
                        Params: showOption,
                    });
                }
            }
            flow.States.push(state);
        }
        flowList.Flows.push(flow);
    }
    return flowList;
}
function testTalkListTool() {
    function testFor(cfg) {
        const caseName = `flow(${cfg.FlowCount}) state(${cfg.StateCount}) talk(${cfg.TalkCount}) item(${cfg.TalkItemCount}) option(${cfg.OptionCount})`;
        (0, Test_1.test)(caseName, () => {
            const flowList1 = createFlowList(cfg);
            const f1 = new TalkListTool_1.TalkListCsvFile();
            f1.Read(flowList1);
            const flowList2 = f1.Gen();
            (0, Test_1.assertEq)(flowListEqual(flowList1, flowList2), true, `${caseName} must the same:\n${JSON.stringify(flowList1)} != \n${JSON.stringify(flowList2)}`);
        });
    }
    testFor({ FlowCount: 0, StateCount: 0, TalkCount: 0, TalkItemCount: 0, OptionCount: 0 });
    testFor({ FlowCount: 1, StateCount: 1, TalkCount: 1, TalkItemCount: 1, OptionCount: 0 });
    testFor({ FlowCount: 1, StateCount: 1, TalkCount: 1, TalkItemCount: 2, OptionCount: 0 });
    testFor({ FlowCount: 1, StateCount: 1, TalkCount: 1, TalkItemCount: 2, OptionCount: 1 });
    testFor({ FlowCount: 1, StateCount: 1, TalkCount: 1, TalkItemCount: 2, OptionCount: 2 });
    testFor({ FlowCount: 1, StateCount: 1, TalkCount: 2, TalkItemCount: 2, OptionCount: 0 });
    testFor({ FlowCount: 1, StateCount: 1, TalkCount: 2, TalkItemCount: 2, OptionCount: 1 });
    testFor({ FlowCount: 1, StateCount: 1, TalkCount: 2, TalkItemCount: 2, OptionCount: 2 });
    testFor({ FlowCount: 1, StateCount: 2, TalkCount: 1, TalkItemCount: 2, OptionCount: 0 });
    testFor({ FlowCount: 1, StateCount: 2, TalkCount: 1, TalkItemCount: 2, OptionCount: 1 });
    testFor({ FlowCount: 1, StateCount: 2, TalkCount: 1, TalkItemCount: 2, OptionCount: 2 });
    testFor({ FlowCount: 1, StateCount: 2, TalkCount: 2, TalkItemCount: 2, OptionCount: 0 });
    testFor({ FlowCount: 1, StateCount: 2, TalkCount: 2, TalkItemCount: 2, OptionCount: 1 });
    testFor({ FlowCount: 1, StateCount: 2, TalkCount: 2, TalkItemCount: 2, OptionCount: 2 });
    testFor({ FlowCount: 2, StateCount: 2, TalkCount: 2, TalkItemCount: 2, OptionCount: 2 });
}
exports.default = testTalkListTool;
//# sourceMappingURL=TestTalkListTool.js.map