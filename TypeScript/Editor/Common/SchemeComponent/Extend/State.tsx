/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { log } from '../../../../Common/Misc/Log';
import { IActionInfo, IFlowInfo, IStateInfo } from '../../../../Game/Interface/IAction';
import { Btn, COLOR_LEVEL2, EditorBox, Fold, Text } from '../../BaseComponent/CommonComponent';
import { ContextBtn } from '../../BaseComponent/ContextBtn';
import { editorFlowOp } from '../../Operations/Flow';
import { ActionScheme } from '../../Scheme/Action/Action';
import { flowContext } from '../../SchemeComponent/Context';
import { Action } from '../../SchemeComponent/Extend/Action';
import { TModifyType } from '../../Type';
import { copyObject, pasteObject } from '../../Util';

export interface IStateProps {
    State: IStateInfo;
    IsDuplicate: boolean;
    ActionScheme: ActionScheme;
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

    private SpwanNewActionAfter(): IActionInfo {
        return this.props.ActionScheme.CreateDefault();
    }

    private readonly AddAction = (): void => {
        this.Modify((from, to) => {
            to.Actions.push(this.SpwanNewActionAfter());
            to._folded = false;
        }, 'normal');
    };

    private readonly InsertAction = (id: number): void => {
        this.Modify((from, to) => {
            let action = pasteObject<IActionInfo>('ActionInfo');
            if (!action) {
                action = this.SpwanNewActionAfter();
            }
            to.Actions.splice(id, 0, action);
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
            case '拷贝':
                copyObject('ActionInfo', this.props.State.Actions[id]);
                break;
            case '粘贴': {
                const actionInfo = pasteObject<IActionInfo>('ActionInfo');
                if (actionInfo) {
                    this.OnActionModify(id, actionInfo, 'normal');
                }
                break;
            }
            case '上插':
                this.InsertAction(id);
                break;
            case '下插':
                this.InsertAction(id + 1);
                break;
            case '移除':
                this.RemoveAction(id);
                break;
            case '上移':
                this.MoveAction(id, true);
                break;
            case '下移':
                this.MoveAction(id, false);
                break;
            default:
                break;
        }
    }

    private ShowStateMoveTo(flow: IFlowInfo): JSX.Element {
        const states = editorFlowOp.GetDestinationStates(flow, this.props.State);
        const statesFormated = states.map((state) => `➔[${state}]`);
        return (
            states.length > 0 && (
                <Text
                    Text={statesFormated.toString()}
                    Color={COLOR_LEVEL2}
                    Tip={'当前状态有可能跳转的状态'}
                />
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
                    Scheme={this.props.ActionScheme}
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
                        Color={this.props.IsDuplicate ? '#8B0000 error' : '#FFFFFF white'}
                    />
                    <EditorBox
                        Text={state.Name}
                        OnChange={this.ChangeName}
                        Color={COLOR_LEVEL2}
                        Tip="状态名字"
                    />
                    <ContextBtn
                        Commands={['拷贝', '粘贴', '上插', '下插', '移除', '上移', '下移']}
                        OnCommand={this.props.OnContextCommand}
                        Tip="针对当前状态项操作"
                    />
                    <Btn Text={'✚动作'} OnClick={this.AddAction} Tip={ADD_ACTION_TIP} />
                    <flowContext.Consumer>
                        {(value): JSX.Element => {
                            return this.ShowStateMoveTo(value);
                        }}
                    </flowContext.Consumer>
                </HorizontalBox>
                {/* <VerticalBox RenderTransform={{ Translation: { X: tabOffset } }}> */}
                <VerticalBox>{state._folded ? undefined : actions}</VerticalBox>
            </VerticalBox>
        );
    }
}
