/* eslint-disable spellcheck/spell-checker */
import { produce } from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { log } from '../../../../Common/Log';
import { TModifyType } from '../../../../Common/Type';
import { IFlowInfo, IStateInfo } from '../../../../Game/Interface/Action';
import {
    Btn,
    COLOR_LEVEL1,
    EditorBox,
    Fold,
    TAB_OFFSET,
} from '../../BaseComponent/CommonComponent';
import { editorFlowOp } from '../../Operations/Flow';
import { ActionScheme } from '../../Scheme/Action/Action';
import { copyObject, pasteObject } from '../../Util';
import { flowContext } from '../Context';
import { State } from './State';

export interface IFlowProps {
    Flow: IFlowInfo;
    IsDuplicate?: boolean;
    PrefixElement?: JSX.Element;
    HideName?: boolean;
    NoIndent?: boolean;
    ActionScheme: ActionScheme;
    OnModify: (flow: IFlowInfo, type: TModifyType) => void;
}

const ADD_STATE_TIP = [
    '增加状态',
    '  状态',
    '    一个剧情由多个状态组成',
    '    一个状态可以包含多个动作',
    '  状态执行顺序',
    '    剧情播放时,根据其指定的状态id进入对应状态',
    '    若状态中的动作包含了状态跳转动作,则跳转到对应的状态',
    '    若状态中的动作执行了[finishState],则状态执行结束',
    '    若状态中的动作全部执行完毕,则状态也执行结束',
    '    状态执行结束后,控制权将交回给外部',
].join('\n');

export class Flow extends React.Component<IFlowProps> {
    private Modify(cb: (from: IFlowInfo, to: IFlowInfo) => void, type: TModifyType): void {
        const { Flow: flow } = this.props;
        const newFlow = produce(flow, (draft) => {
            cb(flow, draft);
        });
        if (flow !== newFlow) {
            this.props.OnModify(newFlow, type);
        }
    }

    private readonly ChangeFold = (): void => {
        this.Modify((from, to) => {
            to._folded = !from._folded;
        }, 'fold');
    };

    private readonly ChangeName = (name: string): void => {
        this.Modify((from, to) => {
            to.Name = name;
        }, 'normal');
    };

    private readonly AddState = (): void => {
        this.Modify((from, to) => {
            to._folded = false;
            to.States.push(editorFlowOp.CreateState(from));
        }, 'normal');
    };

    private readonly InsertState = (id: number): void => {
        this.Modify((from, to) => {
            const pastedState = pasteObject<IStateInfo>('StateInfo');
            const newState = editorFlowOp.CreateState(from);

            if (pastedState) {
                // 确保stateInfo的id和名字唯一
                pastedState.Id = newState.Id;
                pastedState.Name = newState.Name;
            }
            to.States.splice(id + 1, 0, pastedState || newState);
        }, 'normal');
    };

    private readonly MoveState = (id: number, isUp: boolean): void => {
        this.Modify((from, to) => {
            const toStates = to.States;
            const fromStates = from.States;
            if (isUp) {
                if (id > 0) {
                    toStates[id - 1] = fromStates[id];
                    toStates[id] = fromStates[id - 1];
                } else {
                    log(`can not move state ${fromStates[id].Name} up`);
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (id < fromStates.length - 1) {
                    toStates[id + 1] = fromStates[id];
                    toStates[id] = fromStates[id + 1];
                } else {
                    log(`can not move state ${fromStates[id].Name} down`);
                }
            }
        }, 'normal');
    };

    private readonly RemoveState = (id: number): void => {
        this.Modify((from, to) => {
            to.States.splice(id, 1);
        }, 'normal');
    };

    private readonly ModifyState = (id: number, state: IStateInfo, type: TModifyType): void => {
        this.Modify((from, to) => {
            to.States[id] = state;
        }, type);
    };

    private OnContextCommand(id: number, cmd: string): void {
        switch (cmd) {
            case '拷贝':
                copyObject('StateInfo', this.props.Flow.States[id]);
                break;
            case '粘贴': {
                const stateInfo = pasteObject<IStateInfo>('StateInfo');
                if (stateInfo) {
                    // 确保stateInfo的id和名字唯一
                    stateInfo.Id = this.props.Flow.States[id].Id;
                    stateInfo.Name = this.props.Flow.States[id].Name;
                    this.ModifyState(id, stateInfo, 'normal');
                }
                break;
            }
            case '上插':
                this.InsertState(id);
                break;
            case '下插':
                this.InsertState(id + 1);
                break;
            case '移除':
                this.RemoveState(id);
                break;
            case '上移':
                this.MoveState(id, true);
                break;
            case '下移':
                this.MoveState(id, false);
                break;
            default:
                break;
        }
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { Flow: flow } = this.props;
        let nodes: JSX.Element[] = [];
        if (!flow._folded) {
            const { States: states } = flow;
            nodes = states.map((state, id) => {
                return (
                    <State
                        key={id}
                        IsDuplicate={
                            states.find((e) => e !== state && e.Name === state.Name) !== undefined
                        }
                        ActionScheme={this.props.ActionScheme}
                        State={state}
                        OnModify={(newConfig, type): void => {
                            this.ModifyState(id, newConfig, type);
                        }}
                        OnContextCommand={(cmd): void => {
                            this.OnContextCommand(id, cmd);
                        }}
                    />
                );
            });
        }
        return (
            <VerticalBox>
                <flowContext.Provider value={flow}>
                    <HorizontalBox>
                        <Fold
                            IsFold={flow._folded}
                            IsFull={flow.States.length > 0}
                            OnChanged={this.ChangeFold}
                        />
                        {this.props.PrefixElement}
                        {!this.props.HideName && (
                            <EditorBox
                                Text={flow.Name}
                                OnChange={this.ChangeName}
                                Color={this.props.IsDuplicate ? '#8B0000 error' : COLOR_LEVEL1}
                                Tip="剧情名字"
                                Width={100}
                            />
                        )}
                        <Btn Text={'✚状态'} OnClick={this.AddState} Tip={ADD_STATE_TIP} />
                    </HorizontalBox>
                    <VerticalBox
                        RenderTransform={{
                            Translation: { X: this.props.NoIndent ? undefined : TAB_OFFSET },
                        }}
                    >
                        {nodes}
                    </VerticalBox>
                </flowContext.Provider>
            </VerticalBox>
        );
    }
}
