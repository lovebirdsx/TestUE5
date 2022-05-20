/* eslint-disable spellcheck/spell-checker */
import { assertEq, test } from '../../Common/Test';
import { deepEqualsIgnore } from '../../Common/Util';
import { TalkListCsvFile } from '../../Editor/FlowEditor/TalkListTool';
import { flowListOp } from '../../Game/Common/Operations/FlowList';
import { TalkerListOp } from '../../Game/Common/Operations/TalkerList';
import {
    IActionInfo,
    IFlowListInfo,
    IShowOption,
    IShowTalk,
    ITalkItem,
    ITalkOption,
} from '../../Game/Flow/Action';
import { editorFlowOp } from '../Common/Operations/Flow';

function flowListEqual(f1: IFlowListInfo, f2: IFlowListInfo): boolean {
    return deepEqualsIgnore(f1, f2, ['flowGenId', 'stateGenId']);
}

interface ICreateConfig {
    FlowCount: number;
    StateCount: number;
    TalkCount: number;
    OptionCount: number;
    TalkItemCount: number;
}

function createFlowList({
    FlowCount: flowCount,
    StateCount: stateCount,
    TalkCount: talkCount,
    TalkItemCount: talkItemCount,
    OptionCount: optionCount,
}: ICreateConfig): IFlowListInfo {
    const flowList = flowListOp.Create();
    for (let i = 0; i < flowCount; i++) {
        const flow = flowListOp.CreateFlow(flowList);
        flow.Name = `剧情${i + 1}`;
        for (let j = 0; j < stateCount; j++) {
            const state = editorFlowOp.CreateState(flow);
            flow.StateGenId++;
            for (let k = 0; k < talkCount; k++) {
                const showTalk: IShowTalk = {
                    TalkItems: [],
                };

                for (let i1 = 0; i1 < talkItemCount; i1++) {
                    const talkItem: ITalkItem = {
                        Id: i1,
                        Name: `对话${i1}`,
                        WhoId: TalkerListOp.GetId(TalkerListOp.Get(), '小明'),
                        TextId: flowListOp.CreateText(flowList, `对话内容${i1}`),
                    };

                    if (optionCount > 0) {
                        talkItem.Options = [];
                        for (let k1 = 0; k1 < optionCount; k1++) {
                            const option: ITalkOption = {
                                TextId: flowListOp.CreateText(flowList, `选项内容${i1}`),
                                Actions: [],
                            };
                            talkItem.Options.push(option);
                        }
                    }
                    showTalk.TalkItems.push(talkItem);
                }

                const action: IActionInfo = {
                    Name: 'ShowTalk',
                    Params: showTalk,
                };

                state.Actions.push(action);

                // 若要加入多个talkItem,那么必须中间穿插 ShowOption类接口
                // 不然解析时会把所有的talkItem当成1个来处理
                if (talkCount > 1) {
                    const showOption: IShowOption = {
                        TextId: flowListOp.CreateText(flowList, `独立选项内容${k}`),
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

export default function testTalkListTool(): void {
    function testFor(cfg: ICreateConfig): void {
        const caseName = `flow(${cfg.FlowCount}) state(${cfg.StateCount}) talk(${cfg.TalkCount}) item(${cfg.TalkItemCount}) option(${cfg.OptionCount})`;
        test(caseName, () => {
            const flowList1 = createFlowList(cfg);
            const f1 = new TalkListCsvFile();
            f1.Read(flowList1);
            const flowList2 = f1.Gen();
            assertEq(
                flowListEqual(flowList1, flowList2),
                true,
                `${caseName} must the same:\n${JSON.stringify(flowList1)} != \n${JSON.stringify(
                    flowList2,
                )}`,
            );
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
