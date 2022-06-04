/* eslint-disable @typescript-eslint/require-array-sort-compare */
/* eslint-disable spellcheck/spell-checker */

import produce from 'immer';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { getTsClassByUeClass, TTsClassType } from '../../../../Common/Class';
import { IProps, TModifyType } from '../../../../Common/Type';
import { addArray, subArray } from '../../../../Common/Util';
import { entityRegistry } from '../../../../Game/Entity/EntityRegistry';
import TsAiNpc from '../../../../Game/Entity/TsAiNpc';
import { IActionInfo, IInvoke, TActionType } from '../../../../Game/Interface/Action';
import { ActionScheme } from '../../../../Game/Scheme/Action/Action';
import { actionRegistry } from '../../../../Game/Scheme/Action/Public';
import { Check, COLOR_LEVEL3, List, Text } from '../../BaseComponent/CommonComponent';
import { entityListCache } from '../../EntityListCache';
import { entityIdContext, invokeContext } from '../Context';
import { Any } from './Any';

function getActions(tsClassType: TTsClassType, scheme: ActionScheme): TActionType[] {
    const actions = addArray(entityRegistry.GetActionsByTsClass(tsClassType), scheme.ExtraActions);
    return subArray(actions, scheme.FilterActions).sort();
}

class ActionsCache {
    private readonly ActionMapByClass: Map<TTsClassType, Map<ActionScheme, TActionType[]>> =
        new Map();

    private readonly InstantActionMapByClass: Map<TTsClassType, Map<ActionScheme, TActionType[]>> =
        new Map();

    public GetActions(entityId: string, scheme: ActionScheme, isInvoke: boolean): TActionType[] {
        if (entityId === undefined) {
            // FlowEditor中的是没有entityId的上下文的, 则默认按照TsAiNpc的来处理
            return this.GetActionsByClass(TsAiNpc, scheme);
        }

        const entity = entityListCache.GetEntityByGuid(entityId);
        if (!entity) {
            return [];
        }

        const tsClassType = getTsClassByUeClass(entity.GetClass());
        if (!isInvoke) {
            return this.GetActionsByClass(tsClassType, scheme);
        }

        return this.GetInvokeActionsByClass(tsClassType, scheme);
    }

    public GetInvokeActionsByClass(tsClassType: TTsClassType, scheme: ActionScheme): TActionType[] {
        let actionMap = this.InstantActionMapByClass.get(tsClassType);
        if (!actionMap) {
            actionMap = new Map();
            this.InstantActionMapByClass.set(tsClassType, actionMap);
        }

        let actions = actionMap.get(scheme);
        if (!actions) {
            actions = getActions(tsClassType, scheme);
            actions = actions.filter((action) => {
                const actionScheme = actionRegistry.GetScheme(action);
                // 避免Invoke中再次调用Invoke
                return !actionScheme.Scheduled && action !== 'Invoke';
            });
            actionMap.set(scheme, actions);
        }

        return actions;
    }

    public GetActionsByClass(tsClassType: TTsClassType, scheme: ActionScheme): TActionType[] {
        let actionMap = this.ActionMapByClass.get(tsClassType);
        if (!actionMap) {
            actionMap = new Map();
            this.ActionMapByClass.set(tsClassType, actionMap);
        }

        let actions = actionMap.get(scheme);
        if (!actions) {
            actions = getActions(tsClassType, scheme);
            actionMap.set(scheme, actions);
        }

        return actions;
    }
}

const actionsCache = new ActionsCache();

export class Dynamic extends React.Component<IProps<IActionInfo, ActionScheme>> {
    private readonly Select = (name: string): void => {
        const action = actionRegistry.SpawnAction(name as TActionType);
        this.props.OnModify(action, 'normal');
    };

    private readonly ChangeAsync = (async: boolean): void => {
        const action = this.props.Value;
        const newAction = produce(action, (draft) => {
            draft.Async = async;
        });
        this.props.OnModify(newAction, 'normal');
    };

    private readonly Modify = (obj: unknown, type: TModifyType): void => {
        const { Value: action } = this.props;
        const newValue = produce(action, (draft) => {
            draft.Params = obj;
        });
        this.props.OnModify(newValue, type);
    };

    private RenderAction(invoke: IInvoke, entityId: string): JSX.Element {
        const { Scheme: actionScheme, Value: action, PrefixElement: prefixElement } = this.props;
        const scheme = actionRegistry.GetScheme(action.Name);
        const actions = actionsCache.GetActions(entityId, actionScheme, invoke !== undefined);
        return (
            <Any
                Value={action.Params}
                Scheme={scheme}
                OnModify={this.Modify}
                PrefixElement={
                    <HorizontalBox>
                        {prefixElement}
                        <List
                            Items={actions}
                            Selected={action.Name}
                            OnSelectChanged={this.Select}
                            Tip={scheme.Tip}
                            Color={COLOR_LEVEL3}
                        />
                        {scheme.Scheduled && <Text Text="异步" Tip="是否以异步方式执行动作" />}
                        {scheme.Scheduled && (
                            <Check UnChecked={!action.Async} OnChecked={this.ChangeAsync} />
                        )}
                    </HorizontalBox>
                }
            />
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <invokeContext.Consumer>
                {(invoke: IInvoke): JSX.Element => {
                    return (
                        <entityIdContext.Consumer>
                            {(entityId: string): JSX.Element => this.RenderAction(invoke, entityId)}
                        </entityIdContext.Consumer>
                    );
                }}
            </invokeContext.Consumer>
        );
    }
}
