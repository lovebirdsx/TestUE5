/* eslint-disable spellcheck/spell-checker */
import { actionRegistry } from './ActionRunner';
import {
    Activation,
    ChangeActorStateAction,
    FaceToPosAction,
    MoveToPosAction,
    SimpleMoveAction,
} from './Actions/Actor';
import { InvokeAction, LogAction, ShowMessageAction, WaitAction } from './Actions/Base';
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
    actionRegistry.Register('Activate', Activation);
    isInit = true;
}
