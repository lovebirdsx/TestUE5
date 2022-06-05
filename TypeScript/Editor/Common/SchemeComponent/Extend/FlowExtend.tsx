/* eslint-disable @typescript-eslint/naming-convention */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { log } from '../../../../Common/Log';
import { IProps, ObjectScheme, TModifyType } from '../../../../Common/Type';
import { GameConfig } from '../../../../Game/Common/GameConfig';
import { flowOp } from '../../../../Game/Common/Operations/Flow';
import { flowListOp } from '../../../../Game/Common/Operations/FlowList';
import { BehaviorFlowComponent } from '../../../../Game/Component/BehaviorFlowComponent';
import { FlowComponent } from '../../../../Game/Component/FlowComponent';
import { ITsEntity } from '../../../../Game/Interface';
import {
    IFlowInfo,
    IInvoke,
    IPlayFlow,
    ITriggerActions,
    parseFlowInfo,
    parsePlayFlow,
} from '../../../../Game/Interface/Action';
import { IBehaviorFlowComponent } from '../../../../Game/Interface/Component';
import {
    Btn,
    COLOR_LEVEL1,
    COLOR_LEVEL2,
    COLOR_LEVEL3,
    ErrorText,
    Fold,
    List,
    TAB_OFFSET,
    Text,
} from '../../BaseComponent/CommonComponent';
import { editorConfig } from '../../EditorConfig';
import LevelEditorUtil from '../../LevelEditorUtil';
import { behaviorFlowActionScheme } from '../../Scheme/Action/Action';
import { createDefaultPlayFlowFor, playFlowScheme } from '../../Scheme/Action/Flow';
import { sendEditorCommand } from '../../Util';
import { Any, Obj } from '../Basic/Public';
import { entityIdContext, flowContext, invokeContext } from '../Context';
import { Flow } from './Flow';

const DEFAULT_STATE_ID = 1;

function renderStateIdForFlow(flowInfo: IFlowInfo, props: IProps<number>): JSX.Element {
    const stateNames = flowInfo.States.map((e) => e.Name);
    const selectedState = flowInfo.States.find((e) => e.Id === props.Value);
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <List
                Items={stateNames}
                Selected={selectedState ? selectedState.Name : ''}
                Color={COLOR_LEVEL2}
                Tip="目标状态"
                OnSelectChanged={(selectedStateName): void => {
                    const state = flowInfo.States.find((e) => e.Name === selectedStateName);
                    props.OnModify(state ? state.Id : DEFAULT_STATE_ID, 'normal');
                }}
            />
        </HorizontalBox>
    );
}

function renderStateIdForInvokeChangeState(
    entity: ITsEntity,
    invoke: IInvoke,
    props: IProps<number>,
): JSX.Element {
    const flowComponent = LevelEditorUtil.GetEntityComponentData(entity, FlowComponent);
    if (!flowComponent) {
        return <ErrorText Text={`对应实体不存在FlowComponent配置`} />;
    }

    const initState = flowComponent.InitState;
    if (!initState) {
        return <ErrorText Text={`实体没有配置流程`} />;
    }

    const flowList = flowListOp.LoadByName(initState.FlowListName);
    if (!flowList) {
        return <ErrorText Text={`找不到流程配置: ${initState.FlowListName}`} />;
    }
    const flowInfo = flowListOp.GetFlow(flowList, initState.FlowId);
    if (!flowInfo) {
        return <ErrorText Text={`流程id[${initState.FlowId}]不存在`} />;
    }

    return renderStateIdForFlow(flowInfo, props);
}

function renderStateIdForInvokeChangeBehaviorState(
    entity: ITsEntity,
    invoke: IInvoke,
    props: IProps<number>,
): JSX.Element {
    const behaviorComponent = LevelEditorUtil.GetEntityComponentData(entity, BehaviorFlowComponent);
    if (!behaviorComponent) {
        return <ErrorText Text={`实体[${entity.ActorLabel}]不存在BehaviorFlowComponent配置`} />;
    }

    const flowInfo = behaviorComponent.FlowInfo;
    if (!flowInfo) {
        return (
            <ErrorText Text={`实体[${entity.ActorLabel}]BehaviorFlowComponent上不存在流程配置`} />
        );
    }

    return renderStateIdForFlow(flowInfo, props);
}

function renderStateIdForInvoke(invoke: IInvoke, props: IProps<number>): JSX.Element {
    const entity = LevelEditorUtil.GetEntity(invoke.Who);
    if (!entity) {
        return <ErrorText Text={`找不到实体: ${invoke.Who}`} />;
    }

    const actionName = invoke.ActionInfo.Name;
    if (actionName === 'ChangeState' || actionName === 'ChangeRandomState') {
        return renderStateIdForInvokeChangeState(entity, invoke, props);
    }

    if (actionName === 'ChangeBehaviorState') {
        return renderStateIdForInvokeChangeBehaviorState(entity, invoke, props);
    }

    return <ErrorText Text={`Invoke中不支持的State Id上下文, 动作为[${actionName}]`} />;
}

// ChangeState可能在Invoke中被调用, 所以要处理该情况
export function RenderStateId(props: IProps<number>): JSX.Element {
    return (
        <flowContext.Consumer>
            {(value): JSX.Element => {
                return (
                    <invokeContext.Consumer>
                        {(invoke): JSX.Element => {
                            if (invoke === undefined) {
                                return renderStateIdForFlow(value, props);
                            }
                            return renderStateIdForInvoke(invoke, props);
                        }}
                    </invokeContext.Consumer>
                );
            }}
        </flowContext.Consumer>
    );
}

function openFlowEditor(playFlow: IPlayFlow): void {
    editorConfig.FlowConfigPath = flowListOp.GetPath(playFlow.FlowListName);
    editorConfig.LastPlayFlow = playFlow;
    editorConfig.Save();

    sendEditorCommand('RestartFlowEditor');
}

export function RenderPlayFlow(props: IProps): JSX.Element {
    const playFlow = props.Value as IPlayFlow;
    if (flowListOp.Names.length > 0) {
        if (!flowListOp.Names.includes(playFlow.FlowListName)) {
            return (
                <HorizontalBox>
                    {props.PrefixElement}
                    <List
                        Items={flowListOp.Names}
                        Selected={playFlow.FlowListName}
                        OnSelectChanged={function (flowListName: string): void {
                            const newPlayFlow = createDefaultPlayFlowFor(flowListName);
                            props.OnModify(newPlayFlow, 'normal');
                        }}
                        Tip={`选择剧情文件`}
                    />
                </HorizontalBox>
            );
        }

        const flowList = flowListOp.LoadByName(playFlow.FlowListName);
        const flowNames = flowListOp.GetFlowNames(flowList);
        const flow = flowList.Flows.find((flow) => flow.Id === playFlow.FlowId);
        const stateNames = flow ? flowOp.GetStateNames(flow) : [];
        const state = flow ? flowOp.GetState(flow, playFlow.StateId) : undefined;
        return (
            <HorizontalBox>
                {props.PrefixElement}
                <List
                    Items={flowListOp.Names}
                    Selected={playFlow.FlowListName}
                    Color={COLOR_LEVEL3}
                    OnSelectChanged={function (flowListName: string): void {
                        const newPlayFlow = createDefaultPlayFlowFor(flowListName);
                        props.OnModify(newPlayFlow, 'normal');
                    }}
                    Tip={`选择剧情文件`}
                />
                <List
                    Items={flowNames}
                    Selected={flow ? flow.Name : ''}
                    OnSelectChanged={function (flowName: string): void {
                        const newFlow = flowList.Flows.find((flow) => flow.Name === flowName);
                        const newState =
                            newFlow && newFlow.States.length > 0 ? newFlow.States[0] : null;
                        const newPlayFlow: IPlayFlow = {
                            FlowListName: playFlow.FlowListName,
                            FlowId: newFlow ? newFlow.Id : 0,
                            StateId: newState ? newState.Id : 0,
                        };
                        props.OnModify(newPlayFlow, 'normal');
                    }}
                    Color={COLOR_LEVEL1}
                    Tip={`选择剧情`}
                />
                <List
                    Items={stateNames}
                    Selected={state ? state.Name : ''}
                    OnSelectChanged={function (stateName: string): void {
                        const newState = flow.States.find((state) => state.Name === stateName);
                        const newPlayFlow: IPlayFlow = {
                            FlowListName: playFlow.FlowListName,
                            FlowId: playFlow.FlowId,
                            StateId: newState ? newState.Id : 0,
                        };
                        props.OnModify(newPlayFlow, 'normal');
                    }}
                    Color={COLOR_LEVEL2}
                    Tip={`选择状态`}
                />
                <Btn
                    Text={'⊙'}
                    OnClick={(): void => {
                        openFlowEditor(playFlow);
                    }}
                    Tip={'打开流程配置'}
                />
            </HorizontalBox>
        );
    }

    return (
        <HorizontalBox>
            {props.PrefixElement}
            <Text
                Text={`目录:[${GameConfig.FlowListDir}]\n不存在流程配置文件(前缀为[${GameConfig.FlowListPrefix}])`}
            />
        </HorizontalBox>
    );
}

export function RenderPlayFlowJson(props: IProps): JSX.Element {
    const playFlow = parsePlayFlow(props.Value as string);
    const prefixElement = (
        <HorizontalBox>
            {props.PrefixElement}
            <Btn
                Text={'R'}
                OnClick={(): void => {
                    props.OnModify('', 'normal');
                }}
            />
            <Btn
                Text={'P'}
                OnClick={(): void => {
                    log(props.Value as string);
                }}
            />
        </HorizontalBox>
    );

    // 注意下面只能用Any来渲染,Obj不能正确处理自定义Render的情况
    return (
        <VerticalBox>
            {prefixElement}
            <Any
                Value={playFlow}
                Scheme={playFlowScheme}
                OnModify={(newFlow, type): void => {
                    props.OnModify(JSON.stringify(newFlow), type);
                }}
            />
        </VerticalBox>
    );
}

export function RenderTriggerActions(
    props: IProps<ITriggerActions, ObjectScheme<ITriggerActions>>,
): JSX.Element {
    const actions = props.Value;
    const scheme = props.Scheme;
    const prefixElement = (
        <HorizontalBox>
            {props.PrefixElement}
            <Text Text={'动作列表'} />
            <Btn
                Text={'重置'}
                Tip={'重置'}
                OnClick={(): void => {
                    props.OnModify(scheme.CreateDefault(), 'normal');
                }}
            />
            <Btn
                Text={'输出'}
                Tip={'输出动作Json'}
                OnClick={(): void => {
                    log(JSON.stringify(actions.Actions, null, 2));
                }}
            />
        </HorizontalBox>
    );
    return (
        <Obj
            PrefixElement={prefixElement}
            Value={actions}
            Scheme={scheme}
            OnModify={(obj: unknown, type: TModifyType): void => {
                props.OnModify(obj as ITriggerActions, type);
            }}
        />
    );
}

export function RenderBehaviorFlow(
    props: IProps<IBehaviorFlowComponent, ObjectScheme<IBehaviorFlowComponent>>,
): JSX.Element {
    const value = props.Value ? props.Value : { InitStateId: 0, FlowInfo: parseFlowInfo('') };
    return (
        <VerticalBox>
            <HorizontalBox>
                <Fold
                    IsFold={value._folded}
                    IsFull={true}
                    OnChanged={(folded): void => {
                        const newValue = produce(value, (draft) => {
                            draft._folded = folded;
                        });
                        props.OnModify(newValue, 'fold');
                    }}
                />
                {props.PrefixElement}
            </HorizontalBox>
            {!value._folded && (
                <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                    <Flow
                        NoIndent={true}
                        PrefixElement={RenderStateId({
                            PrefixElement: (
                                <HorizontalBox>
                                    <Btn
                                        Text={'C'}
                                        Tip={'清除所有状态'}
                                        OnClick={(): void => {
                                            props.OnModify(props.Scheme.CreateDefault(), 'normal');
                                        }}
                                    />
                                    <Text Text={'初始状态:'} />
                                </HorizontalBox>
                            ),
                            Value: value.InitStateId,
                            OnModify: (stateId, type) => {
                                const newValue = produce(value, (draft) => {
                                    draft.InitStateId = stateId;
                                });
                                props.OnModify(newValue, type);
                            },
                            Scheme: undefined,
                        })}
                        HideName={true}
                        Flow={value.FlowInfo}
                        ActionScheme={behaviorFlowActionScheme}
                        OnModify={(flow, type): void => {
                            const newValue = produce(value, (draft) => {
                                draft.FlowInfo = flow;
                            });
                            props.OnModify(newValue, type);
                        }}
                    />
                </VerticalBox>
            )}
        </VerticalBox>
    );
}

export function RenderInvoke(props: IProps<IInvoke, ObjectScheme<IInvoke>>): JSX.Element {
    return (
        <invokeContext.Provider value={props.Value}>
            <entityIdContext.Provider value={props.Value.Who}>
                <Obj {...props} />
            </entityIdContext.Provider>
        </invokeContext.Provider>
    );
}
