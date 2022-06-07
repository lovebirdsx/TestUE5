/* eslint-disable */
import type {
  EActorState,
  IFlowInfo,
  IPlayFlow,
  ITriggerActions,
  IActionInfo,
  INumberVar,
  IFunction,
  IPosA,
  IVectorInfo,
} from "./ActionPb";

export const protobufPackage = "aki";

/** Component类型 */
export enum EComponent {
  ActorStateComponent = 0,
  BehaviorFlowComponent = 1,
  CalculateComponent = 2,
  EntitySpawnerComponent = 3,
  EventComponent = 4,
  FlowComponent = 5,
  GrabComponent = 6,
  InteractiveComponent = 7,
  LampComponent = 8,
  MoveComponent = 9,
  NpcComponent = 10,
  RefreshEntityComponent = 11,
  RefreshSingleComponent = 12,
  RotatorComponent = 13,
  SimpleComponent = 14,
  SphereComponent = 15,
  SphereFactoryComponent = 16,
  SpringBoardComponent = 17,
  SpringComponent = 18,
  StateComponent = 19,
  SwitcherComponent = 20,
  TalkComponent = 21,
  TrampleComponent = 22,
  TriggerComponent = 23,
  UndergroundComponent = 24,
  UNRECOGNIZED = -1,
}

export interface IActionTypeList {
  /** EActionType中定义的Action枚举名字 */
  Actions: string[];
}

export interface IComponentsConfig {
  BaseActions: IActionTypeList | undefined;
  /** key为EComponent中定义的枚举名字 */
  ActionsByComponent: { [key: string]: IActionTypeList };
}

export interface IComponentsConfig_ActionsByComponentEntry {
  key: string;
  value: IActionTypeList | undefined;
}

export interface IBehaviorFlowComponent {
  InitStateId: number;
  FlowInfo: IFlowInfo | undefined;
}

export interface IFlowComponent {
  InitState: IPlayFlow | undefined;
}

export interface ITriggerComponent {
  MaxTriggerTimes: number;
  IsNotLoad: boolean;
  TriggerActions: ITriggerActions | undefined;
}

export interface ISwitcherComponent {
  Content: string;
  Icon: string;
  OnActions: IActionInfo[];
  OffActions: IActionInfo[];
}

export interface IMoveComponent {
  InitSpeed: number;
}

export interface IActorStateComponent {
  InitState: EActorState;
}

export interface ICalculateComponent {
  Vars: INumberVar[];
  Functions: IFunction[];
}

export interface IRefreshSingle {
  RefreshInterval: number;
  MaxRefreshTimes: number;
  DelayRefresh: boolean;
  TemplateGuid: number;
}

export interface ICylinder {
  IsUse: boolean;
  Radius: number;
  Height: number;
  CylinderPos: IPosA | undefined;
}

export interface IRefreshGroup {
  RefreshInterval: number;
  MaxRefreshTimes: number;
  DelayRefresh: boolean;
  EntityIdList: number[];
  Cylinder: ICylinder | undefined;
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

export interface IRotatorComponent {
  Content: string;
  Icon: string;
  RotatorSpeed: IVectorInfo | undefined;
  LocationOffset: IVectorInfo | undefined;
  RotationOffset: IVectorInfo | undefined;
  RotationMapping: IVectorInfo | undefined;
  IsLocalSpace: boolean;
  EntityId: number;
  IsRotatorSelf: boolean;
  InteractAction: IEventRotator | undefined;
  IsLockZ: boolean;
  IsRecovery: boolean;
}

export interface ISphereFactoryComponent {
  SphereLocation: IVectorInfo | undefined;
  SphereGuid: number;
}

export interface ISettingSpringDir {
  IsSettingDir: boolean;
  IsRotator: boolean;
  SpringDir: IVectorInfo | undefined;
}

export interface ISpringComponent {
  IsNormalSpring: boolean;
  IsHitNormalSpring: boolean;
  SettingDir: ISettingSpringDir | undefined;
  SpringPow: number;
}

export interface ITrampleComponent {
  IsDisposable: boolean;
  TriggerActions: IActionInfo[];
  RecoveryActions: IActionInfo[];
}

export interface IUndergroundComponent {
  TestState: number;
  IsRestartPlayer: boolean;
  DestroyTag: string[];
  StateInfo: IUndergroundComponent_IStateInfo[];
}

export interface IUndergroundComponent_IStateInfo {
  StateId: number;
  RestartPos: IVectorInfo | undefined;
}

export interface IGrabComponent {
  GrabPos: IVectorInfo | undefined;
  ThrowPow: number;
  ThrowHight: number;
}
