/* eslint-disable spellcheck/spell-checker */
import {
    IActionInfo,
    IFlowInfo,
    IFunction,
    INumberVar,
    IPlayFlow,
    IPosA,
    ITriggerActions,
    IVectorInfo,
    TActionType,
    TActorState,
} from './IAction';

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

// 服务器: IComponentConfig从Config/Component.json中读取
export interface IComponentConfig {
    BaseActions: TActionType[];
    ActionsByComponent: { [key in TComponentType]: TActionType[] };
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

export const DEFAULT_INIT_SPEED = 150;

export interface IMoveComponent {
    // 默认速度为DEFAULT_INIT_SPEED
    InitSpeed: number;
}

export interface IActorStateComponent {
    InitState: TActorState;
}

export interface ICalculateComponent {
    Vars: INumberVar[];
    Functions: IFunction[];
}

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
    AnimClass: string;
}
