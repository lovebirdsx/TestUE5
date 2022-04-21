/* eslint-disable spellcheck/spell-checker */
import { ObjectScheme } from '../../../../Common/Type';
import { TActionType } from '../../../../Game/Flow/Action';
import { actionRegistry } from './ActionRegistry';
import { playFlowScheme } from './Flow';
import { FinishTalkScheme, JumpTalkScheme } from './JumpTalk';
import { logScheme, showMssageScheme, waitScheme } from './Misc';
import { setCameraModeScheme, setFlowBoolOptionScheme, setPlotModeScheme } from './PlotNode';
import { playCustomSequenceScheme, playSequenceDataScheme } from './Sequence';
import { showOptionScheme, showTalkScheme } from './ShowTalk';
import { showCenterTextScheme } from './ShowText';
import { changeRandomStateScheme, changeStateScheme, finishStateScheme } from './State';

const objectSchemeMap: { [key in TActionType]: ObjectScheme<unknown> } = {
    ChangeState: changeStateScheme as ObjectScheme<unknown>,
    ChangeRandomState: changeRandomStateScheme as ObjectScheme<unknown>,
    FinishTalk: new FinishTalkScheme(),
    FinishState: finishStateScheme,
    JumpTalk: new JumpTalkScheme() as ObjectScheme<unknown>,
    Log: logScheme as ObjectScheme<unknown>,
    PlayFlow: playFlowScheme as ObjectScheme<unknown>,
    PlaySequenceData: playSequenceDataScheme as ObjectScheme<unknown>,
    PlayCustomSequence: playCustomSequenceScheme as ObjectScheme<unknown>,
    SetCameraMode: setCameraModeScheme as ObjectScheme<unknown>,
    SetFlowBoolOption: setFlowBoolOptionScheme as ObjectScheme<unknown>,
    SetPlotMode: setPlotModeScheme as ObjectScheme<unknown>,
    ShowCenterText: showCenterTextScheme as ObjectScheme<unknown>,
    ShowMessage: showMssageScheme as ObjectScheme<unknown>,
    ShowOption: showOptionScheme as ObjectScheme<unknown>,
    ShowTalk: showTalkScheme as ObjectScheme<unknown>,
    Wait: waitScheme as ObjectScheme<unknown>,
};

actionRegistry.SetupObjectMap(objectSchemeMap);

export * from './ActionRegistry';
export * from './Flow';
export * from './Sequence';
