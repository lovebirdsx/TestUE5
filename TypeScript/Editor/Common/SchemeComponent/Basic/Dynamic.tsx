/* eslint-disable @typescript-eslint/require-array-sort-compare */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import {
    getActionsByEntityType,
    getEntityTypeByBlueprintType,
} from '../../../../Common/Interface/Entity';
import { IActionInfo, IInvoke, TActionType } from '../../../../Common/Interface/IAction';
import { TEntityType } from '../../../../Common/Interface/IEntity';
import { addArray, subArray } from '../../../../Common/Misc/Util';
import { Check, COLOR_LEVEL3, List, Text } from '../../BaseComponent/CommonComponent';
import { levelDataManager } from '../../LevelDataManager';
import { ActionScheme } from '../../Scheme/Action/Action';
import { actionRegistry } from '../../Scheme/Action/Public';
import { IProps, TModifyType } from '../../Type';
import { entityIdContext, invokeContext } from '../Context';
import { Any } from './Any';

function getActions(entityType: TEntityType, scheme: ActionScheme): TActionType[] {
    const actions = addArray(getActionsByEntityType(entityType), scheme.ExtraActions);
    return subArray(actions, scheme.FilterActions).sort();
}

class ActionsCache {
    private readonly ActionMapByEntityType: Map<TEntityType, Map<ActionScheme, TActionType[]>> =
        new Map();

    private readonly InstantActionMapByEntityType: Map<
        TEntityType,
        Map<ActionScheme, TActionType[]>
    > = new Map();

    public GetActions(entityId: number, scheme: ActionScheme, isInvoke: boolean): TActionType[] {
        if (entityId === undefined) {
            // FlowEditor中的是没有entityId的上下文的, 则默认按照TsAiNpc的来处理
            return this.GetActionsByEntityType('AiNpc', scheme);
        }

        const entityData = levelDataManager.GetEntityDataById(entityId);
        const entityType = getEntityTypeByBlueprintType(entityData.BlueprintType);
        if (!isInvoke) {
            return this.GetActionsByEntityType(entityType, scheme);
        }

        return this.GetInvokeActionsByClass(entityType, scheme);
    }

    public GetInvokeActionsByClass(entityType: TEntityType, scheme: ActionScheme): TActionType[] {
        let actionMap = this.InstantActionMapByEntityType.get(entityType);
        if (!actionMap) {
            actionMap = new Map();
            this.InstantActionMapByEntityType.set(entityType, actionMap);
        }

        let actions = actionMap.get(scheme);
        if (!actions) {
            actions = getActions(entityType, scheme);
            actions = actions.filter((action) => {
                const actionScheme = actionRegistry.GetScheme(action);
                // 避免Invoke中再次调用Invoke
                return !actionScheme.Scheduled && action !== 'Invoke';
            });
            actionMap.set(scheme, actions);
        }

        return actions;
    }

    public GetActionsByEntityType(entityType: TEntityType, scheme: ActionScheme): TActionType[] {
        let actionMap = this.ActionMapByEntityType.get(entityType);
        if (!actionMap) {
            actionMap = new Map();
            this.ActionMapByEntityType.set(entityType, actionMap);
        }

        let actions = actionMap.get(scheme);
        if (!actions) {
            actions = getActions(entityType, scheme);
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

    private RenderAction(invoke: IInvoke, entityId: number): JSX.Element {
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
                            {(entityId: number): JSX.Element => this.RenderAction(invoke, entityId)}
                        </entityIdContext.Consumer>
                    );
                }}
            </invokeContext.Consumer>
        );
    }
}
