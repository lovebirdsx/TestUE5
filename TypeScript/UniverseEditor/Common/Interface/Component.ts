/* eslint-disable spellcheck/spell-checker */
import { isUe5 } from '../Init';
import { TActionType } from './IAction';
import { IComponentConfig, TComponentType } from './IComponent';

const baseActionsUe5: TActionType[] = ['Log', 'Wait', 'ShowMessage'];

const baseActionsAki: TActionType[] = ['Invoke', 'Log', 'Wait', 'ShowMessage'];

const actionsByComponentAki: Partial<{ [key in TComponentType]: TActionType[] }> = {};

const actionsByComponentUe5: Partial<{ [key in TComponentType]: TActionType[] }> = {
    ActorStateComponent: ['ChangeActorState'],
    BehaviorFlowComponent: ['ChangeBehaviorState', 'SetBehaviorIsPaused'],
    CalculateComponent: [
        'SetNumberVar',
        'SyncVarToActorState',
        'DoCalculate',
        'CallFunction',
        'CallByCondition',
    ],
    EntitySpawnerComponent: ['SpawnChild', 'Destroy', 'DestroyAllChild'],
    EventComponent: ['Activate'],
    FlowComponent: ['ChangeState'],
    InteractiveComponent: [],
    MoveComponent: ['MoveToPos', 'SetPos', 'FaceToPos', 'SetMoveSpeed'],
    SimpleComponent: ['SimpleMove'],
};

export function getBaseActions(): TActionType[] {
    return isUe5() ? baseActionsUe5 : baseActionsAki;
}

export function getActionsByComponentType(component: TComponentType): TActionType[] {
    return actionsByComponentUe5[component] || [];
}

export const componentConfig: IComponentConfig = {
    BaseActions: isUe5() ? baseActionsUe5 : baseActionsAki,
    ActionsByComponent: isUe5() ? actionsByComponentUe5 : actionsByComponentAki,
};
