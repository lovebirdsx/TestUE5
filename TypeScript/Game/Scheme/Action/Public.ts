/* eslint-disable spellcheck/spell-checker */
import { ObjectScheme } from '../../../Common/Type';
import { TActionType } from '../../Flow/Action';
import { actionRegistry } from './ActionRegistry';
import {
    callByConditionScheme,
    callFunctionScheme,
    doCalculateScheme,
    setNumberVarScheme,
} from './Calculate';
import { destroyScheme, interactScheme, invokeScheme } from './Invoke';
import { finishTalkScheme, jumpTalkScheme } from './JumpTalk';
import { logScheme, showMssageScheme, waitScheme } from './Misc';
import { faceToPosScheme, moveToPosScheme, setPosScheme, simpleMoveScheme } from './Move';
import { setCameraModeScheme, setFlowBoolOptionScheme, setPlotModeScheme } from './PlotNode';
import { playCustomSequenceScheme, playSequenceDataScheme } from './Sequence';
import { showOptionScheme, showTalkScheme } from './ShowTalk';
import { showCenterTextScheme } from './ShowText';
import { destroyAllChildScheme, spawnChildScheme } from './Spawn';
import {
    changeActorStateScheme,
    changeBehaviorStateScheme,
    changeRandomStateScheme,
    changeStateScheme,
    finishStateScheme,
    setBehaviorIsPausedScheme,
} from './State';
import { setHeadIconVisibleScheme } from './Talker';

export const objectSchemeMap: { [key in TActionType]: ObjectScheme<unknown> } = {
    CallByCondition: callByConditionScheme,
    CallFunction: callFunctionScheme,
    ChangeActorState: changeActorStateScheme,
    ChangeBehaviorState: changeBehaviorStateScheme,
    ChangeState: changeStateScheme,
    ChangeRandomState: changeRandomStateScheme,
    Destroy: destroyScheme,
    DestroyAllChild: destroyAllChildScheme,
    DoCalculate: doCalculateScheme,
    FaceToPos: faceToPosScheme,
    FinishTalk: finishTalkScheme,
    FinishState: finishStateScheme,
    JumpTalk: jumpTalkScheme,
    Invoke: invokeScheme,
    Log: logScheme,
    MoveToPos: moveToPosScheme,
    PlaySequenceData: playSequenceDataScheme,
    PlayCustomSequence: playCustomSequenceScheme,
    SetBehaviorIsPaused: setBehaviorIsPausedScheme,
    SetCameraMode: setCameraModeScheme,
    SetHeadIconVisible: setHeadIconVisibleScheme,
    SetNumberVar: setNumberVarScheme,
    SetFlowBoolOption: setFlowBoolOptionScheme,
    SetPlotMode: setPlotModeScheme,
    SetPos: setPosScheme,
    ShowCenterText: showCenterTextScheme,
    ShowMessage: showMssageScheme,
    ShowOption: showOptionScheme,
    ShowTalk: showTalkScheme,
    SpawnChild: spawnChildScheme,
    Wait: waitScheme,
    SimpleMove: simpleMoveScheme,
    Activate: interactScheme,
};

actionRegistry.SetupObjectMap(objectSchemeMap);

export * from './ActionRegistry';
export * from './Flow';
export * from './Sequence';
