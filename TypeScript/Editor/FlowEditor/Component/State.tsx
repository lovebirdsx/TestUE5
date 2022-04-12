/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import {
    Btn,
    EditorBox,
    Fold,
    SlotText,
    Text,
} from '../../../Editor/Common/Component/CommonComponent';
import { ContextBtn } from '../../../Editor/Common/Component/ContextBtn';
import { IActionInfo, IFlowInfo, IStateInfo } from '../../../Game/Flow/Action';
import { log } from '../../Common/Log';
import { scheme, TModifyType } from '../../Common/Scheme/Action';
import { FlowOp } from '../Operations/Flow';
import { Action } from './Action';
import { flowContext } from './Flow';

export interface IStateProps {
    State: IStateInfo;
    IsDuplicate: boolean;
    OnContextCommand: (cmd: string) => void;
    OnModify: (state: IStateInfo, type: TModifyType) => void;
}

const ADD_ACTION_TIP = [
    '增加动作',
    '  动作',
    '    不同的动作包含了不同的功能',
    '    显示对话也是通过动作来实现的',
    '  执行方式',
    '    同步: 默认的执行方式,当前动作执行完毕后才执行下一条动作',
    '    异步: 当前动作执行后,不等待其完毕,马上执行下一条',
    '  动作上下文',
    '    在不同的执行上下文中,可以执行的动作是不一样的',
    '    譬如:',
    '      [showTalk]动作只能在状态层执行',
    '      [jumpTalk]动作只能在[showTalk]中执行',
].join('\n');

export class State extends React.Component<IStateProps> {
    private Modify(cb: (from: IStateInfo, to: IStateInfo) => void, type: TModifyType): void {
        const { State: state } = this.props;
        const newState = produce(state, (draft) => {
            cb(state, draft);
        });
        this.props.OnModify(newState, type);
    }

    private readonly ChangeFold = (): void => {
        this.Modify((from, to) => {
            to._folded = !from._folded;
        }, 'fold');
    };

    private SpwanNewActionAfter(state: IStateInfo, id: number): IActionInfo {
        return scheme.SpawnDefaultAction('normal');
    }

    private readonly AddAction = (): void => {
        this.Modify((from, to) => {
            to.Actions.push(this.SpwanNewActionAfter(from, from.Actions.length - 1));
            to._folded = false;
        }, 'normal');
    };

    private readonly InsertAction = (id: number): void => {
        this.Modify((from, to) => {
            const action = this.SpwanNewActionAfter(from, id);
            to.Actions.splice(id + 1, 0, action);
        }, 'normal');
    };

    private readonly RemoveAction = (id: number): void => {
        this.Modify((from, to) => {
            to.Actions.splice(id, 1);
        }, 'normal');
    };

    private readonly MoveAction = (id: number, isUp: boolean): void => {
        this.Modify((from, to) => {
            if (isUp) {
                if (id > 0) {
                    to.Actions[id] = from.Actions[id - 1];
                    to.Actions[id - 1] = from.Actions[id];
                } else {
                    log(`Can not move action ${from.Actions[id].Name} up`);
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (id < from.Actions.length - 1) {
                    to.Actions[id] = from.Actions[id + 1];
                    to.Actions[id + 1] = from.Actions[id];
                } else {
                    log(`Can not move action ${from.Actions[id].Name} down`);
                }
            }
        }, 'normal');
    };

    private readonly ChangeName = (name: string): void => {
        this.Modify((from, to) => {
            to.Name = name;
        }, 'normal');
    };

    private readonly OnActionModify = (
        id: number,
        action: IActionInfo,
        type: TModifyType,
    ): void => {
        this.Modify((from, to) => {
            to.Actions[id] = action;
        }, type);
    };

    private OnContextCommand(id: number, cmd: string): void {
        switch (cmd) {
            case 'insert':
                this.InsertAction(id);
                break;
            case 'remove':
                this.RemoveAction(id);
                break;
            case 'moveUp':
                this.MoveAction(id, true);
                break;
            case 'moveDown':
                this.MoveAction(id, false);
                break;
            default:
                break;
        }
    }

    private ShowStateMoveTo(flow: IFlowInfo): React.ReactNode {
        const states = FlowOp.GetDestinationStates(flow, this.props.State);
        const statesFormated = states.map((state) => `➔[${state}]`);
        return (
            states.length > 0 && (
                <SlotText Text={statesFormated.toString()} Tip={'当前状态有可能跳转的状态'} />
            )
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { State: state } = this.props;
        const actions = state.Actions.map((e, id) => {
            return (
                <Action
                    key={id}
                    Action={e}
                    OnModify={(action, type): void => {
                        this.OnActionModify(id, action, type);
                    }}
                    OnContextCommand={(cmd): void => {
                        this.OnContextCommand(id, cmd);
                    }}
                />
            );
        });
        return (
            <VerticalBox>
                <HorizontalBox>
                    <Fold
                        IsFold={state._folded}
                        IsFull={state.Actions.length > 0}
                        OnChanged={this.ChangeFold}
                    />
                    <Text
                        Text={'●'}
                        Color={this.props.IsDuplicate ? '#8B0000 dark red' : '#FFFFFF white'}
                    />
                    <EditorBox Text={state.Name} OnChange={this.ChangeName} Tip="状态名字" />
                    <ContextBtn
                        Commands={['insert', 'remove', 'moveUp', 'moveDown']}
                        OnCommand={this.props.OnContextCommand}
                        Tip="针对当前状态项操作"
                    />
                    <Btn Text={'✚动作'} OnClick={this.AddAction} Tip={ADD_ACTION_TIP} />
                    <flowContext.Consumer>
                        {(value): React.ReactNode => {
                            return this.ShowStateMoveTo(value);
                        }}
                    </flowContext.Consumer>
                </HorizontalBox>
                {/* <VerticalBox RenderTransform={{ Translation: { X: tabOffset } }}> */}
                <VerticalBox>{state._folded ? null : actions}</VerticalBox>
            </VerticalBox>
        );
    }
}
