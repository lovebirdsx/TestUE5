/* eslint-disable spellcheck/spell-checker */
import { IPosA, IVectorInfo } from '../../Common/Interface';
import {
    IActionInfo,
    IFlowInfo,
    IFunction,
    INumberVar,
    IPlayFlow,
    ITriggerActions,
    TActionType,
    TActorState,
} from './Action';

export type TComponentType =
    | 'ActorStateComponent'
    | 'BehaviorFlowComponent'
    | 'CalculateComponent'
    | 'EntitySpawnerComponent'
    | 'EventComponent'
    | 'FlowComponent'
    | 'GrabComponent'
    | 'InteractiveComponent'
    | 'LampComponent'
    | 'ModelComponent'
    | 'MoveComponent'
    | 'NpcComponent'
    | 'RefreshEntityComponent'
    | 'RefreshSingleComponent'
    | 'RotatorComponent'
    | 'SimpleComponent'
    | 'SphereComponent'
    | 'SphereFactoryComponent'
    | 'SpringBoardComponent'
    | 'SpringComponent'
    | 'StateComponent'
    | 'SwitcherComponent'
    | 'TalkComponent'
    | 'TrampleComponent'
    | 'TriggerComponent'
    | 'UndergroundComponent';

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
    ModelComponent: [],
};

export function getActionsByComponentType(component: TComponentType): TActionType[] {
    return actionsByComponent[component];
}

export interface IInteractiveComponent {
    Content: string;
    Icon: string;
}

export interface IBehaviorFlowComponent {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _folded?: boolean;
    InitStateId: number;
    FlowInfo: IFlowInfo;
}

export interface IFlowComponent {
    InitState: IPlayFlow;
}

export interface ITriggerComponent {
    MaxTriggerTimes: number;
    IsNotLoad: boolean;
    TriggerActions: ITriggerActions;
}

export interface ISwitcherComponent extends IInteractiveComponent {
    OnActions: IActionInfo[];
    OffActions: IActionInfo[];
}

export interface IMoveComponent {
    InitSpeed: number;
}

export interface IActorStateComponent {
    InitState: TActorState;
}

export interface ICalculateComponent {
    Vars: INumberVar[];
    Functions: IFunction[];
}

export const DEFAULT_INIT_SPEED = 150;

export interface ITempleGuid {
    TempleGuid: number;
}

export interface IRefreshSingle {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    TemplateGuid: ITempleGuid;
}

export interface ICylinder {
    IsUse: boolean;
    Radius: number;
    Height: number;
    CylinderPos: IPosA;
}

export interface IRefreshGroup {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    EntityIdList: number[];
    IsUesCylinder: ICylinder;
}

export interface IRefreshSingleComponent {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    TemplateGuid: number;
}

export interface IEventRotator {
    StartActions: IActionInfo[];
    EndActions: IActionInfo[];
}

export interface IRotatorComponent extends IInteractiveComponent {
    RotatorSpeed: IVectorInfo;
    LocationOffset: IVectorInfo;
    RotationOffset: IVectorInfo;
    RotationMapping: IVectorInfo;
    IsLocalSpace: boolean;
    EntityId: number;
    IsRotatorSelf: boolean;
    InteractAction: IEventRotator;
    IsLockZ: boolean;
    IsRecovery: boolean;
}

export interface ISphereFactoryComponent {
    SphereLocation: IVectorInfo;
    SphereGuid: number;
}

export interface ISettingSpringDir {
    IsSettingDir: boolean;
    IsRotator: boolean;
    SpringDir: IVectorInfo;
}

export interface ISpringComponent {
    IsNormalSpring: boolean;
    IsHitNormalSpring: boolean;
    SettingDir: ISettingSpringDir;
    SpringPow: number;
}

export interface ITrampleComponent {
    IsDisposable: boolean;
    TriggerActions: IActionInfo[];
    RecoveryActions: IActionInfo[];
}

export interface IStateInfo {
    StateId: number;
    RestartPos: IVectorInfo;
}

export interface IUndergroundComponent {
    TestState: number;
    IsRestartPlayer: boolean;
    DestroyTag: string[];
    StateInfo: IStateInfo[];
}

export interface IGrabComponent {
    GrabPos: IVectorInfo;
    ThrowPow: number;
    ThrowHight: number;
}

export interface IModelComponent {
    MeshClass: string;
    AbpClass: string;
}
