/* eslint-disable spellcheck/spell-checker */
import { TActionType } from './IAction';
import { IComponentConfig, TComponentType } from './IComponent';

export const baseActions: TActionType[] = ['Invoke', 'Log', 'Wait', 'ShowMessage'];

export const actionsByComponent: { [key in TComponentType]: TActionType[] } = {
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
    RefreshSingleComponent: [],
    RotatorComponent: [],
    SimpleComponent: ['SimpleMove'],
    SphereFactoryComponent: [],
    SpringComponent: [],
    SwitcherComponent: [],
    TrampleComponent: [],
    TriggerComponent: [],
    UndergroundComponent: [],
    GrabComponent: [],
    NpcComponent: [],
    RefreshEntityComponent: [],
    SphereComponent: [],
    StateComponent: [],
    TalkComponent: [],
    LampComponent: [],
    SpringBoardComponent: [],
};

export function getActionsByComponentType(component: TComponentType): TActionType[] {
    return actionsByComponent[component];
}

export const componentConfig: IComponentConfig = {
    BaseActions: baseActions,
    ActionsByComponent: actionsByComponent,
};
