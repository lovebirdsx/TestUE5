/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */

import { MyFileHelper } from 'ue';

import { flowListOp } from '../../Game/Common/Operations/FlowList';
import { TalkerListOp } from '../../Game/Common/Operations/TalkerList';
import {
    IActionInfo,
    IFlowInfo,
    IFlowListInfo,
    IShowOption,
    IShowTalk,
    IStateInfo,
    ITalkItem,
    ITalkOption,
    TActionType,
} from '../../Game/Flow/Action';
import { editorFlowOp } from '../Common/Operations/Flow';

type TCsvTalkType = '对话' | '对话选项' | '独立选项';

const csvRowConfig = {
    Flow: '剧情',
    State: '状态',
    TalkId: '对话id',
    TalkType: '对话类型',
    Who: '对话人',
    TalkContent: '对话内容',
    OptionContent: '选项内容',
};

function parseTitles(config: Record<string, string>): string[] {
    const titles: string[] = [];
    for (const key in config) {
        titles.push(config[key]);
    }
    return titles;
}

const csvRowTitles = parseTitles(csvRowConfig);

type TCsvRowBase<T> = { [key in keyof typeof csvRowConfig]?: T };

interface ICsvRow extends TCsvRowBase<unknown> {
    Flow: string; // 剧情
    State: string; // 状态
    TalkId?: string; // 对话id
    TalkType: TCsvTalkType; // 对话类型
    Who?: string; // 说话人
    TalkContent?: string; // 对话内容
    OptionContent?: string; // 选项内容
}

export class TalkListCsvFile {
    private Rows: ICsvRow[];

    public Load(path: string): void {
        const content = MyFileHelper.Read(path);
        if (!content) {
            throw new Error('can not open file');
        }
        this.Parse(content);
    }

    public Save(path: string): void {
        MyFileHelper.Write(path, this.Stringify());
    }

    public Gen(): IFlowListInfo {
        const flows: IFlowInfo[] = [];
        const flowList = flowListOp.Create();
        flowList.Flows = flows;

        let lastAction: IActionInfo = null;
        let lastFlow: IFlowInfo = null;
        let lastState: IStateInfo = null;
        let lastTalkItem: ITalkItem = null;
        let lastTalkId = 0;
        this.Rows.forEach((row) => {
            const {
                Flow: flow,
                State: state,
                TalkId: talkId,
                TalkType: talkType,
                Who: who,
                TalkContent: talkContent,
                OptionContent: optionContent,
            } = row;

            if (!lastFlow || flow !== lastFlow.Name) {
                lastFlow = flowListOp.CreateFlow(flowList);
                flows.push(lastFlow);
                lastFlow.Name = flow;
                lastState = undefined;
            }

            if (!lastState || lastState.Name !== state) {
                lastState = editorFlowOp.CreateState(lastFlow);
                lastAction = undefined;
                lastFlow.States.push(lastState);
                lastState.Name = state;
            }

            const actionType: TActionType = talkType === '独立选项' ? 'ShowOption' : 'ShowTalk';
            if (!lastAction || actionType !== lastAction.Name) {
                lastAction = {
                    Name: actionType,
                    Params: undefined,
                };
                lastState.Actions.push(lastAction);
            }

            if (actionType === 'ShowOption') {
                lastAction.Params = {
                    TextId: flowListOp.CreateText(flowList, optionContent),
                } as IShowOption;
                lastAction = undefined;
            } else if (actionType === 'ShowTalk') {
                if (!lastAction.Params) {
                    lastAction.Params = { TalkItems: [] } as IShowTalk;
                    lastTalkId = 0;
                }

                if (talkType === '对话') {
                    const showTalk = lastAction.Params as IShowTalk;
                    lastTalkItem = {
                        WhoId: TalkerListOp.GetId(TalkerListOp.Get(), who),
                        TextId: flowListOp.CreateText(flowList, talkContent),
                        Name: talkId,
                        Id: lastTalkId++,
                    };
                    showTalk.TalkItems.push(lastTalkItem);
                } else if (talkType === '对话选项') {
                    if (!lastTalkItem) {
                        throw new Error('talk option must flow by talk');
                    }
                    if (!lastTalkItem.Options) {
                        lastTalkItem.Options = [];
                    }
                    const talkOption: ITalkOption = {
                        TextId: flowListOp.CreateText(flowList, optionContent),
                        Actions: [],
                    };
                    lastTalkItem.Options.push(talkOption);
                }
            }
        });

        return flowList;
    }

    public Read(flowList: IFlowListInfo): void {
        const rows: ICsvRow[] = [];
        flowList.Flows.forEach((flow) => {
            flow.States.forEach((state) => {
                state.Actions.forEach((action) => {
                    if (action.Name === 'ShowOption') {
                        const showOption = action.Params as IShowOption;
                        rows.push({
                            Flow: flow.Name,
                            State: state.Name,
                            TalkType: '独立选项',
                            OptionContent: flowList.Texts[showOption.TextId].Text,
                        });
                    } else if (action.Name === 'ShowTalk') {
                        const showTalk = action.Params as IShowTalk;
                        showTalk.TalkItems.forEach((item) => {
                            rows.push({
                                Flow: flow.Name,
                                State: state.Name,
                                TalkId: item.Name,
                                TalkType: '对话',
                                Who: TalkerListOp.GetName(TalkerListOp.Get(), item.WhoId),
                                TalkContent: flowList.Texts[item.TextId].Text,
                            });

                            if (item.Options) {
                                item.Options.forEach((option) => {
                                    rows.push({
                                        Flow: flow.Name,
                                        State: state.Name,
                                        TalkType: '对话选项',
                                        OptionContent: flowList.Texts[option.TextId].Text,
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
        this.Rows = rows;
    }

    private ParseRow(line: string): ICsvRow {
        const fields = line.split(',');
        const fieldsTrim = fields.map((f) => f.trim());
        return {
            Flow: fieldsTrim[0],
            State: fieldsTrim[1],
            TalkId: fieldsTrim[2],
            TalkType: fieldsTrim[3] as TCsvTalkType,
            Who: fieldsTrim[4],
            TalkContent: fieldsTrim[5],
            OptionContent: fieldsTrim[6],
        };
    }

    private StringifyRow(row: ICsvRow): string {
        return `${row.Flow},${row.State},${row.TalkId || ''},${row.TalkType},${row.Who || ''},${
            row.TalkContent || ''
        },${row.OptionContent || ''}`;
    }

    private Parse(content: string): void {
        const rows: ICsvRow[] = [];
        const lineRows = content.split('\r\n');

        const headLine = lineRows[0].trim();
        if (headLine !== csvRowTitles.join(',')) {
            throw new Error('Invalid talklist csv format');
        }

        lineRows.forEach((line, index) => {
            if (index > 0 && line.trim()) {
                rows.push(this.ParseRow(line));
            }
        });

        this.Rows = rows;
    }

    private Stringify(): string {
        const lines: string[] = [];
        lines.push(csvRowTitles.join(','));
        this.Rows.forEach((row) => {
            lines.push(this.StringifyRow(row));
        });
        return lines.join('\r\n');
    }
}

export class TalkListTool {
    public static Import(path: string): IFlowListInfo {
        const csvFile = new TalkListCsvFile();
        csvFile.Load(path);
        return csvFile.Gen();
    }

    public static Export(flowinfo: IFlowListInfo, path: string): void {
        const csvFile = new TalkListCsvFile();
        csvFile.Read(flowinfo);
        csvFile.Save(path);
    }
}
