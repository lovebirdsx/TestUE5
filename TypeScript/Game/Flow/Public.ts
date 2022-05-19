/* eslint-disable spellcheck/spell-checker */
import { actionRegistry } from './ActionRunner';
import {
    Activation,
    ChangeActorStateAction,
    FaceToPosAction,
    MoveToPosAction,
    SetMoveSpeedAction,
    SetPosAction,
    SimpleMoveAction,
} from './Actions/Actor';
import { InvokeAction, LogAction, ShowMessageAction, WaitAction } from './Actions/Base';
import {
    CallByConditionAction,
    CallFunctionAction,
    DoCalculateAction,
    SetNumberVarAction,
    SyncVarToActorStateAction,
} from './Actions/Calculate';
import {
    ChangeBehaviorStateAction,
    ChangeStateAction,
    FinishStateAction,
    FinishTalkAction,
    JumpTalkAction,
    SetBehaviorPausedAction,
    ShowTalkAction,
} from './Actions/Flow';
import { DestroyAction, DestroyAllChildAction, SpawnChildAction } from './Actions/Spawn';

let isInit = false;

export function initFlow(): void {
    if (isInit) {
        return;
    }

    actionRegistry.Register('ChangeActorState', ChangeActorStateAction);
    actionRegistry.Register('ChangeBehaviorState', ChangeBehaviorStateAction);
    actionRegistry.Register('ChangeState', ChangeStateAction);
    actionRegistry.Register('Destroy', DestroyAction);
    actionRegistry.Register('DestroyAllChild', DestroyAllChildAction);
    actionRegistry.Register('FaceToPos', FaceToPosAction);
    actionRegistry.Register('FinishState', FinishStateAction);
    actionRegistry.Register('FinishTalk', FinishTalkAction);
    actionRegistry.Register('Invoke', InvokeAction);
    actionRegistry.Register('JumpTalk', JumpTalkAction);
    actionRegistry.Register('Log', LogAction);
    actionRegistry.Register('MoveToPos', MoveToPosAction);
    actionRegistry.Register('SetBehaviorIsPaused', SetBehaviorPausedAction);
    actionRegistry.Register('ShowMessage', ShowMessageAction);
    actionRegistry.Register('ShowTalk', ShowTalkAction);
    actionRegistry.Register('SimpleMove', SimpleMoveAction);
    actionRegistry.Register('SpawnChild', SpawnChildAction);
    actionRegistry.Register('Wait', WaitAction);
    actionRegistry.Register('SetPos', SetPosAction);
    actionRegistry.Register('SetMoveSpeed', SetMoveSpeedAction);
    actionRegistry.Register('Activate', Activation);
    actionRegistry.Register('SetNumberVar', SetNumberVarAction);
    actionRegistry.Register('SyncVarToActorState', SyncVarToActorStateAction);
    actionRegistry.Register('DoCalculate', DoCalculateAction);
    actionRegistry.Register('CallFunction', CallFunctionAction);
    actionRegistry.Register('CallByCondition', CallByConditionAction);

    isInit = true;
}
