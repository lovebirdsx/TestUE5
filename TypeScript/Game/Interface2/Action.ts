/* eslint-disable */
export const protobufPackage = "aki";

/** Action类型 */
export enum EAction {
  Activate = 0,
  CallByCondition = 1,
  CallFunction = 2,
  ChangeActorState = 3,
  ChangeBehaviorState = 4,
  ChangeRandomState = 5,
  ChangeState = 6,
  Destroy = 7,
  DestroyAllChild = 8,
  DoCalculate = 9,
  FaceToPos = 10,
  FinishState = 11,
  FinishTalk = 12,
  Invoke = 13,
  JumpTalk = 14,
  Log = 15,
  MoveToPos = 16,
  PlayCustomSequence = 17,
  PlaySequenceData = 18,
  SetBehaviorIsPaused = 19,
  SetCameraMode = 20,
  SetFlowBoolOption = 21,
  SetHeadIconVisible = 22,
  SetMoveSpeed = 23,
  SetNumberVar = 24,
  SetPlotMode = 25,
  SetPos = 26,
  ShowCenterText = 27,
  ShowMessage = 28,
  ShowOption = 29,
  ShowTalk = 30,
  SimpleMove = 31,
  SpawnChild = 32,
  SyncVarToActorState = 33,
  Wait = 34,
  UNRECOGNIZED = -1,
}

export enum ELogLevel {
  Info = 0,
  Warn = 1,
  Error = 2,
  UNRECOGNIZED = -1,
}

/** Flow控制选项 */
export enum EFlowBoolOption {
  /** DisableInput - 是否禁止输入 */
  DisableInput = 0,
  /** DisableViewControl - 是否禁止视角控制 */
  DisableViewControl = 1,
  /** HideUi - 是否隐藏其它UI */
  HideUi = 2,
  /** CanSkip - 是否可以跳过 */
  CanSkip = 3,
  /** CanInteractive - 是否可以交互 */
  CanInteractive = 4,
  UNRECOGNIZED = -1,
}

/** 相机模式 */
export enum ECameraMode {
  /** Drama - 剧情相机 */
  Drama = 0,
  /** Follow - 跟随 */
  Follow = 1,
  /** FollowDrama - 跟随相机剧情模式 */
  FollowDrama = 2,
  UNRECOGNIZED = -1,
}

/** 剧情模式 */
export enum EPlotMode {
  /** LevelA - A级演出 */
  LevelA = 0,
  /** LevelB - B级演出 */
  LevelB = 1,
  /** LevelC - C级演出 */
  LevelC = 2,
  /** LevelD - D级演出 */
  LevelD = 3,
  UNRECOGNIZED = -1,
}

/** 绑定镜头的类型 */
export enum ECameraBindMode {
  /** One - 1角色 */
  One = 0,
  /** Two - 2角色 */
  Two = 1,
  /** Three - 3角色 */
  Three = 2,
  /** None - 无 */
  None = 3,
  UNRECOGNIZED = -1,
}

export enum EActorState {
  /** Idle - 待机 */
  Idle = 0,
  /** Open - 打开 */
  Open = 1,
  /** Close - 关闭 */
  Close = 2,
  UNRECOGNIZED = -1,
}

export enum ECalOp {
  /** Add - + */
  Add = 0,
  /** Sub - - */
  Sub = 1,
  /** Mut -  */
  Mut = 2,
  /** Div - / */
  Div = 3,
  UNRECOGNIZED = -1,
}

export enum ECompare {
  /** Ge - >= */
  Ge = 0,
  /** Gt - > */
  Gt = 1,
  /** Le - <= */
  Le = 2,
  /** Lt - < */
  Lt = 3,
  /** Eq - == */
  Eq = 4,
  /** Ne - != */
  Ne = 5,
  UNRECOGNIZED = -1,
}

export enum ELogicOpType {
  /** And - 与 */
  And = 0,
  /** Or - 或 */
  Or = 1,
  UNRECOGNIZED = -1,
}

export interface IActionInfo {
  /** EAction中定义的枚举名字 */
  Name: string;
  Async: boolean;
  Params?: { [key: string]: any } | undefined;
}

export interface IInvoke {
  Who: number;
  ActionInfo: IActionInfo | undefined;
}

export interface IInteract {
  Who: number;
  Param: string;
}

export interface ITriggerActions {
  Actions: IActionInfo[];
}

export interface IStateInfo {
  Id: number;
  Name: string;
  Actions: IActionInfo[];
}

export interface IFlowInfo {
  Id: number;
  Name: string;
  States: IStateInfo[];
}

export interface IPlayFlow {
  FlowListName: string;
  FlowId: number;
  StateId: number;
}

export interface ITextConfig {
  Text: string;
  Sound: string;
}

export interface IFlowListInfo {
  Texts: { [key: number]: ITextConfig };
  Flows: IFlowInfo[];
}

export interface IFlowListInfo_TextsEntry {
  key: number;
  value: ITextConfig | undefined;
}

export interface ILog {
  Level: ELogLevel;
  Content: string;
}

export interface IShowMessage {
  Content: string;
}

export interface IJumpTalk {
  TalkId: number;
}

export interface ISetHeadIconVisible {
  WhoId: number;
  Visible: boolean;
}

export interface ITalkOption {
  TextId: number;
  Actions: IActionInfo[];
}

export interface ITalkItem {
  Id: number;
  Name: string;
  WhoId: number;
  TextId: number;
  WaitTime?: number | undefined;
  Actions: IActionInfo[];
  Options: ITalkOption[];
}

export interface IShowTalk {
  ResetCamera: boolean;
  TalkItems: ITalkItem[];
}

export interface IShowOption {
  TextId: number;
}

export interface IChangeState {
  StateId: number;
}

export interface IChangeBehaviorState {
  StateId: number;
  IsInstant: boolean;
}

export interface ISetBehaviorPaused {
  IsPaused: boolean;
}

export interface IChangeRandomState {
  StateIds: number[];
}

/** 设定Flow的控制选项 */
export interface ISetFlowBoolOption {
  Option: EFlowBoolOption;
  Value: boolean;
}

/** 设定相机模式 */
export interface ISetCameraMode {
  Mode: ECameraMode;
}

/** 设定剧情模式 */
export interface ISetPlotMode {
  Mode: EPlotMode;
}

export interface IPlaySequenceData {
  Path: string;
}

/** 播放自定义Sequence,CustomSeqId对应[自定义序列]配表中的配置 */
export interface IPlayCustomSequence {
  CustomSeqId: number;
  WhoIds: number[];
}

/** 等待一段时间 */
export interface IWait {
  Min?: number | undefined;
  Time: number;
}

export interface IShowCenterText {
  TextId: number;
}

export interface IVectorInfo {
  X?: number | undefined;
  Y?: number | undefined;
  Z?: number | undefined;
}

export interface IPosA {
  X?: number | undefined;
  Y?: number | undefined;
  Z?: number | undefined;
  A?: number | undefined;
}

export interface IMoveToPosA {
  Timeout: number;
  Pos: IPosA | undefined;
}

export interface ISetMoveSpeed {
  Speed: number;
}

export interface ISetPosA {
  Pos: IPosA | undefined;
}

export interface IFaceToPos {
  Pos: IVectorInfo | undefined;
}

export interface ITransform {
  Pos: IVectorInfo | undefined;
  Rot?: IVectorInfo | undefined;
  Scale?: IVectorInfo | undefined;
}

export interface ISpawn {
  TemplateGuid: number;
  Transform: ITransform | undefined;
}

export interface ISimpleMove {
  Who: number;
  UseTime: number;
  Pos: IVectorInfo | undefined;
}

export interface IChangeActorState {
  State: EActorState;
}

export interface TVar {
  /** number */
  intValue: number | undefined;
  /** string */
  stringValue: string | undefined;
}

export interface INumberVar {
  Name: string;
  Value: number;
}

export interface ISetNumberVar {
  Name: string;
  Value: TVar | undefined;
}

export interface ISyncVarToActorState {
  VarName: string;
  StateKey: string;
}

export interface IDoCalculate {
  Var1: TVar | undefined;
  Op: ECalOp;
  Var2: TVar | undefined;
  Result: string;
}

export interface ICondition {
  Var1: TVar | undefined;
  Var2: TVar | undefined;
  Compare: ECompare;
}

export interface IConditions {
  LogicOpType: ELogicOpType;
  Conditions: ICondition[];
}

export interface ICallByCondition {
  Conditions: IConditions | undefined;
  TrueActions: IActionInfo[];
  FalseActions: IActionInfo[];
}

export interface IFunction {
  Name: string;
  Actions: IActionInfo[];
}

export interface ICallFunction {
  Name: string;
}
