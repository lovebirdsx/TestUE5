/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox, VerticalBoxSlot } from 'react-umg';

import { log } from '../../../../Common/Log';
import { EActionFilter, TModifyType } from '../../../../Common/Type';
import { flowListOp } from '../../../../Game/Common/Operations/FlowList';
import { IFlowInfo, IFlowListInfo } from '../../../../Game/Flow/Action';
import { Btn } from '../../BaseComponent/CommonComponent';
import { ContextBtn } from '../../BaseComponent/ContextBtn';
import { copyObject, pasteObject } from '../../Util';
import { Flow } from './Flow';

export interface IFlowListProps {
    FlowList: IFlowListInfo;
    OnModify: (flowList: IFlowListInfo, type: TModifyType) => void;
}

function foldAll(obj: unknown, value: boolean, force: boolean): void {
    if (typeof obj !== 'object') {
        return;
    }

    const recObj = obj as Record<string, unknown>;

    for (const key in obj) {
        if (key.startsWith('_') && key.toLowerCase().endsWith('folded')) {
            recObj[key] = value;
        } else if (force) {
            recObj._folded = value;
        }

        const field = recObj[key];
        if (typeof field === 'object') {
            foldAll(field, value, false);
        }
    }
}
const FLOW_TIP = [
    '增加剧情',
    '  剧情',
    '    一个剧情配置文件,由多段剧情组成',
    '    每个剧情具有唯一的id,可以被外部调用',
    '  剧情调用',
    '    输入: 剧情id',
    '    输出: 结果参数(通过[finishState]动作来指定)',
].join('\n');

export class FlowList extends React.Component<IFlowListProps, unknown> {
    private Modify(cb: (from: IFlowListInfo, to: IFlowListInfo) => void, type: TModifyType): void {
        const { FlowList: flowList } = this.props;
        const newflowList = produce(flowList, (draft) => {
            cb(flowList, draft);
        });
        if (flowList !== newflowList) {
            this.props.OnModify(newflowList, type);
        }
    }

    private readonly AddFlow = (): void => {
        this.Modify((from, to) => {
            const flow = flowListOp.CreateFlow(from);
            to.Flows.push(flow);
            to.FlowGenId = this.props.FlowList.FlowGenId + 1;
        }, 'normal');
    };

    private readonly InsertFlow = (id: number): void => {
        this.Modify((from, to) => {
            const newFlow = flowListOp.CreateFlow(this.props.FlowList);
            to.Flows.splice(id, 0, newFlow);
        }, 'normal');
    };

    private readonly RemoveFlow = (id: number): void => {
        this.Modify((from, to) => {
            to.Flows.splice(id, 1);
        }, 'normal');
    };

    private readonly OnContextCommand = (id: number, cmd: string): void => {
        switch (cmd) {
            case '拷贝':
                copyObject('FlowInfo', this.props.FlowList.Flows[id]);
                break;
            case '粘贴': {
                const flowInfo = pasteObject<IFlowInfo>('FlowInfo');
                if (flowInfo) {
                    this.ModifiedFlow(id, flowInfo, 'normal');
                }
                break;
            }
            case '上插':
                this.InsertFlow(id);
                break;
            case '下插':
                this.InsertFlow(id + 1);
                break;
            case '移除':
                this.RemoveFlow(id);
                break;
            case '上移':
                this.FlowMove(id, true);
                break;
            case '下移':
                this.FlowMove(id, false);
                break;
            default:
                break;
        }
    };

    private readonly FlowMove = (id: number, isUp: boolean): void => {
        this.Modify((from, to) => {
            const { Flows: flows } = from;
            const flow = flows[id];
            if (id === 0 && isUp) {
                log(`${flow.Name} can not move up`);
                return;
            }

            if (id === flows.length - 1 && !isUp) {
                log(`${flow.Name} can not move down`);
                return;
            }

            if (isUp) {
                to.Flows[id] = flows[id - 1];
                to.Flows[id - 1] = flows[id];
            } else {
                to.Flows[id] = flows[id + 1];
                to.Flows[id + 1] = flows[id];
            }
        }, 'normal');
    };

    private readonly ModifiedFlow = (id: number, flow: IFlowInfo, type: TModifyType): void => {
        this.Modify((from, draft) => {
            draft.Flows[id] = flow;
        }, type);
    };

    private readonly FoldAll = (value: boolean): void => {
        this.Modify((from, draft) => {
            draft.Flows.forEach((flow) => {
                foldAll(flow, value, true);
            });
        }, 'fold');
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { Flows: flows } = this.props.FlowList;
        const nodes = flows.map((flow, id) => {
            return (
                <Flow
                    key={id}
                    Flow={flow}
                    ObjectFilter={EActionFilter.FlowList}
                    IsDuplicate={
                        flows.find((e1) => e1 !== flow && e1.Name === flow.Name) !== undefined
                    }
                    OnModify={(newFlow, type): void => {
                        this.ModifiedFlow(id, newFlow, type);
                    }}
                    PrefixElement={
                        <ContextBtn
                            Commands={['拷贝', '粘贴', '上插', '下插', '移除', '上移', '下移']}
                            OnCommand={(cmd): void => {
                                this.OnContextCommand(id, cmd);
                            }}
                            Tip="针对当前剧情项操作"
                        />
                    }
                />
            );
        });

        const rootSlot: VerticalBoxSlot = {
            Padding: { Left: 10, Bottom: 10 },
        };
        return (
            <VerticalBox Slot={rootSlot}>
                <HorizontalBox>
                    <Btn Text={'✚流程'} OnClick={this.AddFlow} Tip={FLOW_TIP} />
                    <Btn
                        Text={'▼▼'}
                        OnClick={(): void => {
                            this.FoldAll(false);
                        }}
                        Tip="展开所有"
                    />
                    <Btn
                        Text={'▶▶'}
                        OnClick={(): void => {
                            this.FoldAll(true);
                        }}
                        Tip="折叠所有"
                    />
                </HorizontalBox>
                {nodes}
            </VerticalBox>
        );
    }
}
