/* eslint-disable spellcheck/spell-checker */
import { IPosA, ITransform, IVectorInfo } from '../../Common/Interface';

export type TActionType =
    | 'Activate'
    | 'CallByCondition'
    | 'CallFunction'
    | 'ChangeActorState'
    | 'ChangeBehaviorState'
    | 'ChangeRandomState'
    | 'ChangeState'
    | 'Destroy'
    | 'DestroyAllChild'
    | 'DoCalculate'
    | 'FaceToPos'
    | 'FinishState'
    | 'FinishTalk'
    | 'Invoke'
    | 'JumpTalk'
    | 'Log'
    | 'MoveToPos'
    | 'PlayCustomSequence'
    | 'PlaySequenceData'
    | 'SetBehaviorIsPaused'
    | 'SetCameraMode'
    | 'SetFlowBoolOption'
    | 'SetHeadIconVisible'
    | 'SetMoveSpeed'
    | 'SetNumberVar'
    | 'SetPlotMode'
    | 'SetPos'
    | 'ShowCenterText'
    | 'ShowMessage'
    | 'ShowOption'
    | 'ShowTalk'
    | 'SimpleMove'
    | 'SpawnChild'
    | 'SyncVarToActorState'
    | 'Wait';

export type TActionFun = (action: IActionInfo) => unknown;

export interface IActionInfo {
    Name: TActionType;
    Async?: boolean;
    Params: unknown;
}

export interface IInvoke {
    Who: number;
    ActionInfo: IActionInfo;
}

export interface IInteract {
    Who: number;
    Param: string;
}

export interface ITriggerActions {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _folded?: boolean;
    Actions: IActionInfo[];
}

export function parseTriggerActionsJson(json: string): ITriggerActions {
    if (!json || typeof json !== 'string') {
        return {
            Actions: [],
        };
    }

    return JSON.parse(json) as ITriggerActions;
}

export interface IStateInfo {
    Id: number;
    Name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _folded?: boolean;
    Actions: IActionInfo[];
}

export interface IFlowInfo {
    Id: number;
    Name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _folded?: boolean;
    States: IStateInfo[];
}

export function parseFlowInfo(json: string): IFlowInfo {
    if (!json) {
        return {
            Id: 0,
            Name: 'Flow',
            States: [],
        };
    }

    return JSON.parse(json) as IFlowInfo;
}

export interface IPlayFlow {
    FlowListName: string;
    FlowId: number;
    StateId: number;
}

export function parsePlayFlow(json: string): IPlayFlow {
    if (!json) {
        return {
            FlowListName: '',
            FlowId: 0,
            StateId: 0,
        };
    }

    return JSON.parse(json) as IPlayFlow;
}

export interface ITextConfig {
    Text: string;
    Sound: string;
}

export interface IFlowListInfo {
    Texts: Record<number, ITextConfig>;
    Flows: IFlowInfo[];
}

export const logLeveConfig = {
    Info: '提示',
    Warn: '警告',
    Error: '错误',
};

export type TLogLevel = keyof typeof logLeveConfig;

export interface ILog {
    Level: TLogLevel;
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
    Actions?: IActionInfo[];
}

export interface ITalkItem {
    Id: number;
    Name: string;
    WhoId: number;
    TextId: number;
    WaitTime?: number;
    Actions?: IActionInfo[];
    Options?: ITalkOption[];
}

export interface IShowTalk {
    ResetCamera?: boolean;
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

// Plot Node 相关动作 ============================================
export const flowBoolOptionConfig = {
    DisableInput: '是否禁止输入',
    DisableViewControl: '是否禁止视角控制',
    HideUi: '是否隐藏其它UI',
    CanSkip: '是否可以跳过',
    CanInteractive: '是否可以交互',
};

export type TFlowBoolOption = keyof typeof flowBoolOptionConfig;

// 设定相关的控制选项
export interface ISetFlowBoolOption {
    Option: TFlowBoolOption;
    Value: boolean;
}

export const cameraModeConfig = {
    Drama: '剧情相机',
    Follow: '跟随',
    FollowDrama: '跟随相机剧情模式',
};

export type TCameraMode = keyof typeof cameraModeConfig;

// 设定相机模式
export interface ISetCameraMode {
    Mode: TCameraMode;
}

export const plotModeConfig = {
    LevelA: 'A级演出',
    LevelB: 'B级演出',
    LevelC: 'C级演出',
    LevelD: 'D级演出',
};

export type TPlotMode = keyof typeof plotModeConfig;

// 设定剧情模式
export interface ISetPlotMode {
    Mode: TPlotMode;
}

export interface IPlaySequenceData {
    Path: string;
}

// 播放自定义Sequence,CustomSeqId对应[自定义序列]配表中的配置
export interface IPlayCustomSequence {
    CustomSeqId: number;
    WhoIds: number[];
}

// 等待一段时间
export interface IWait {
    Min?: number;
    Time: number;
}

// 绑定镜头的类型
export const cameraBindModeConfig = {
    One: '1角色',
    Two: '2角色',
    Three: '3角色',
    None: '无',
};

export type TCameraBindMode = keyof typeof cameraBindModeConfig;

export interface IShowCenterText {
    TextId: number;
}

export interface IMoveToPosA {
    Timeout: number;
    Pos: IPosA;
}

export interface ISetMoveSpeed {
    Speed: number;
}

export interface ISetPosA {
    Pos: IPosA;
}

export interface IFaceToPos {
    Pos: IVectorInfo;
}

export interface ISpawn {
    TemplateGuid: number;
    Transform: ITransform;
}

export interface ISimpleMove {
    Who: number;
    UseTime: number;
    Pos: IVectorInfo;
}

export const actorStateConfig = {
    Idle: '待机',
    Open: '打开',
    Close: '关闭',
};

export type TActorState = keyof typeof actorStateConfig;

export interface IChangeActorState {
    State: TActorState;
}

export type TVar = number | string;

export interface INumberVar {
    Name: string;
    Value: number;
}

export interface ISetNumberVar {
    Name: string;
    Value: TVar;
}

export interface ISyncVarToActorState {
    VarName: string;
    StateKey: string;
}

export const calOpTypeConfig = {
    Add: '+',
    Sub: '-',
    Mut: 'X',
    Div: '/',
};

export type TCalOp = keyof typeof calOpTypeConfig;

export interface IDoCalculate {
    Var1: TVar;
    Op: TCalOp;
    Var2: TVar;
    Result: string;
}

export const compareTypeConfig = {
    Ge: '>=',
    Gt: '>',
    Le: '<=',
    Lt: '<',
    Eq: '==',
    Ne: '!=',
};

export type TCompare = keyof typeof compareTypeConfig;

export interface ICondition {
    Var1: TVar;
    Var2: TVar;
    Compare: TCompare;
}

export const logicOpTypeConfig = {
    And: '与',
    Or: '或',
};

export type TLogicOpType = keyof typeof logicOpTypeConfig;

export interface IConditions {
    LogicOpType: TLogicOpType;
    Conditions: ICondition[];
}

export interface ICallByCondition {
    Conditions: IConditions;
    TrueActions?: IActionInfo[];
    FalseActions?: IActionInfo[];
}

export interface IFunction {
    Name: string;
    Actions: IActionInfo[];
}

export interface ICallFunction {
    Name: string;
}
