/* eslint-disable spellcheck/spell-checker */
import { ObjectScheme } from '../../../Common/Type';
import { TActionType } from '../../Flow/Action';
import { actionRegistry } from './ActionRegistry';
import { destroyScheme, invokeScheme } from './Invoke';
import { finishTalkScheme, jumpTalkScheme } from './JumpTalk';
import { logScheme, showMssageScheme, waitScheme } from './Misc';
import { faceToPosScheme, moveToPosScheme } from './Move';
import { setCameraModeScheme, setFlowBoolOptionScheme, setPlotModeScheme } from './PlotNode';
import { playCustomSequenceScheme, playSequenceDataScheme } from './Sequence';
import { showOptionScheme, showTalkScheme } from './ShowTalk';
import { showCenterTextScheme } from './ShowText';
import { spawnScheme } from './Spawn';
import { changeRandomStateScheme, changeStateScheme, finishStateScheme } from './State';
import { setHeadIconVisibleScheme } from './Talker';

const objectSchemeMap: { [key in TActionType]: ObjectScheme<unknown> } = {
    ChangeState: changeStateScheme,
    ChangeRandomState: changeRandomStateScheme,
    Destroy: destroyScheme,
    FaceToPos: faceToPosScheme,
    FinishTalk: finishTalkScheme,
    FinishState: finishStateScheme,
    JumpTalk: jumpTalkScheme,
    Invoke: invokeScheme,
    Log: logScheme,
    MoveToPos: moveToPosScheme,
    PlaySequenceData: playSequenceDataScheme,
    PlayCustomSequence: playCustomSequenceScheme,
    SetCameraMode: setCameraModeScheme,
    SetHeadIconVisible: setHeadIconVisibleScheme,
    SetFlowBoolOption: setFlowBoolOptionScheme,
    SetPlotMode: setPlotModeScheme,
    ShowCenterText: showCenterTextScheme,
    ShowMessage: showMssageScheme,
    ShowOption: showOptionScheme,
    ShowTalk: showTalkScheme,
    Spawn: spawnScheme,
    Wait: waitScheme,
};

actionRegistry.SetupObjectMap(objectSchemeMap);

export * from './ActionRegistry';
export * from './Flow';
export * from './Sequence';
