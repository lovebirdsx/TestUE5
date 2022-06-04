/* eslint-disable spellcheck/spell-checker */
import { IVectorType } from '../../Common/Type';
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
    | 'InteractiveComponent'
    | 'MoveComponent'
    | 'RefreshSingleComponent'
    | 'RotatorComponent'
    | 'SimpleComponent'
    | 'SphereFactoryComponent'
    | 'SpringComponent'
    | 'SwitcherComponent'
    | 'TrampleComponent'
    | 'TriggerComponent'
    | 'UndergroundComponent';

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
};

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
    TempleGuid: string;
}

export interface IRefreshSingle {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    TemplateGuid: ITempleGuid;
}

export interface IRefreshGroup {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    EntityGuidList: string[];
}

export interface IRefreshSingleComponent {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    TemplateGuid: ITempleGuid;
}

export interface IEventRotator {
    StartActions: IActionInfo[];
    EndActions: IActionInfo[];
}

export interface IRotatorComponent extends IInteractiveComponent {
    // fix: 使用IVectorInfo
    RotatorSpeed: IVectorType;
    LocationOffset: IVectorType;
    RotationOffset: IVectorType;
    RotationMapping: IVectorType;
    IsLocalSpace: boolean;
    EntityId: string;
    IsRotatorSelf: boolean;
    InteractAction: IEventRotator;
    IsLockZ: boolean;
    IsRecovery: boolean;
}

export interface ISphereFactoryComponent {
    SphereLocation: IVectorType;
    SphereGuid: string;
}

export interface ISettingSpringDir {
    IsSettingDir: boolean;
    IsRotator: boolean;
    SpringDir: IVectorType;
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
    RestartPos: IVectorType;
}

export interface IUndergroundComponent {
    TestState: number;
    IsRestartPlayer: boolean;
    DestroyTag: string[];
    StateInfo: IStateInfo[];
}
