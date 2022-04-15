"use strict";
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkListTool = exports.TalkListCsvFile = void 0;
const ue_1 = require("ue");
const Flow_1 = require("../Common/Operations/Flow");
const FlowList_1 = require("../Common/Operations/FlowList");
const TalkerList_1 = require("../TalkerEditor/TalkerList");
const csvRowConfig = {
    Flow: '剧情',
    State: '状态',
    TalkId: '对话id',
    TalkType: '对话类型',
    Who: '对话人',
    TalkContent: '对话内容',
    OptionContent: '选项内容',
};
function parseTitles(config) {
    const titles = [];
    for (const key in config) {
        titles.push(config[key]);
    }
    return titles;
}
const csvRowTitles = parseTitles(csvRowConfig);
class TalkListCsvFile {
    Rows;
    Load(path) {
        const content = ue_1.MyFileHelper.Read(path);
        if (!content) {
            throw new Error('can not open file');
        }
        this.Parse(content);
    }
    Save(path) {
        ue_1.MyFileHelper.Write(path, this.Stringify());
    }
    Gen() {
        const flows = [];
        const flowList = FlowList_1.flowListOp.Create();
        flowList.Flows = flows;
        let lastAction = null;
        let lastFlow = null;
        let lastState = null;
        let lastTalkItem = null;
        let lastTalkId = 0;
        this.Rows.forEach((row) => {
            const { Flow: flow, State: state, TalkId: talkId, TalkType: talkType, Who: who, TalkContent: talkContent, OptionContent: optionContent, } = row;
            if (!lastFlow || flow !== lastFlow.Name) {
                lastFlow = FlowList_1.flowListOp.CreateFlow(flowList);
                flows.push(lastFlow);
                flowList.FlowGenId++;
                lastFlow.Name = flow;
                lastState = undefined;
            }
            if (!lastState || lastState.Name !== state) {
                lastState = Flow_1.flowOp.CreateState(lastFlow);
                lastAction = undefined;
                lastFlow.States.push(lastState);
                lastFlow.StateGenId++;
                lastState.Name = state;
            }
            const actionType = talkType === '独立选项' ? 'ShowOption' : 'ShowTalk';
            if (!lastAction || actionType !== lastAction.Name) {
                lastAction = {
                    Name: actionType,
                    Params: undefined,
                };
                lastState.Actions.push(lastAction);
            }
            if (actionType === 'ShowOption') {
                lastAction.Params = {
                    TextId: FlowList_1.flowListOp.CreateText(flowList, optionContent),
                };
                lastAction = undefined;
            }
            else if (actionType === 'ShowTalk') {
                if (!lastAction.Params) {
                    lastAction.Params = { TalkItems: [] };
                    lastTalkId = 0;
                }
                if (talkType === '对话') {
                    const showTalk = lastAction.Params;
                    lastTalkItem = {
                        WhoId: TalkerList_1.TalkerListOp.GetId(TalkerList_1.TalkerListOp.Get(), who),
                        TextId: FlowList_1.flowListOp.CreateText(flowList, talkContent),
                        Name: talkId,
                        Id: lastTalkId++,
                    };
                    showTalk.TalkItems.push(lastTalkItem);
                }
                else if (talkType === '对话选项') {
                    if (!lastTalkItem) {
                        throw new Error('talk option must flow by talk');
                    }
                    if (!lastTalkItem.Options) {
                        lastTalkItem.Options = [];
                    }
                    const talkOption = {
                        TextId: FlowList_1.flowListOp.CreateText(flowList, optionContent),
                        Actions: [],
                    };
                    lastTalkItem.Options.push(talkOption);
                }
            }
        });
        return flowList;
    }
    Read(flowList) {
        const rows = [];
        flowList.Flows.forEach((flow) => {
            flow.States.forEach((state) => {
                state.Actions.forEach((action) => {
                    if (action.Name === 'ShowOption') {
                        const showOption = action.Params;
                        rows.push({
                            Flow: flow.Name,
                            State: state.Name,
                            TalkType: '独立选项',
                            OptionContent: flowList.Texts[showOption.TextId],
                        });
                    }
                    else if (action.Name === 'ShowTalk') {
                        const showTalk = action.Params;
                        showTalk.TalkItems.forEach((item) => {
                            rows.push({
                                Flow: flow.Name,
                                State: state.Name,
                                TalkId: item.Name,
                                TalkType: '对话',
                                Who: TalkerList_1.TalkerListOp.GetName(TalkerList_1.TalkerListOp.Get(), item.WhoId),
                                TalkContent: flowList.Texts[item.TextId],
                            });
                            if (item.Options) {
                                item.Options.forEach((option) => {
                                    rows.push({
                                        Flow: flow.Name,
                                        State: state.Name,
                                        TalkType: '对话选项',
                                        OptionContent: flowList.Texts[option.TextId],
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
    ParseRow(line) {
        const fields = line.split(',');
        const fieldsTrim = fields.map((f) => f.trim());
        return {
            Flow: fieldsTrim[0],
            State: fieldsTrim[1],
            TalkId: fieldsTrim[2],
            TalkType: fieldsTrim[3],
            Who: fieldsTrim[4],
            TalkContent: fieldsTrim[5],
            OptionContent: fieldsTrim[6],
        };
    }
    StringifyRow(row) {
        return `${row.Flow},${row.State},${row.TalkId || ''},${row.TalkType},${row.Who || ''},${row.TalkContent || ''},${row.OptionContent || ''}`;
    }
    Parse(content) {
        const rows = [];
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
    Stringify() {
        const lines = [];
        lines.push(csvRowTitles.join(','));
        this.Rows.forEach((row) => {
            lines.push(this.StringifyRow(row));
        });
        return lines.join('\r\n');
    }
}
exports.TalkListCsvFile = TalkListCsvFile;
class TalkListTool {
    static Import(path) {
        const csvFile = new TalkListCsvFile();
        csvFile.Load(path);
        return csvFile.Gen();
    }
    static Export(flowinfo, path) {
        const csvFile = new TalkListCsvFile();
        csvFile.Read(flowinfo);
        csvFile.Save(path);
    }
}
exports.TalkListTool = TalkListTool;
//# sourceMappingURL=TalkListTool.js.map