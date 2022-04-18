/* eslint-disable spellcheck/spell-checker */
import { TObjectType } from '../../../../Common/Type';
import { TActionType } from '../../../../Game/Flow/Action';
import { actionRegistry } from './ActionRegistry';
import { playFlowScheme } from './Flow';
import { finishTalkScheme, jumpTalkScheme } from './JumpTalk';
import { logScheme, showMssageScheme, waitScheme } from './Misc';
import { setCameraModeScheme, setFlowBoolOptionScheme, setPlotModeScheme } from './PlotNode';
import { playSequenceDataScheme } from './Sequence';
import { showOptionScheme, showTalkScheme } from './ShowTalk';
import { showCenterTextScheme } from './ShowText';
import { changeRandomStateScheme, changeStateScheme, finishStateScheme } from './State';

const actionSchemeMap: { [key in TActionType]: TObjectType<unknown> } = {
    ChangeState: changeStateScheme as TObjectType<unknown>,
    ChangeRandomState: changeRandomStateScheme as TObjectType<unknown>,
    FinishTalk: finishTalkScheme,
    FinishState: finishStateScheme,
    JumpTalk: jumpTalkScheme as TObjectType<unknown>,
    Log: logScheme as TObjectType<unknown>,
    PlayFlow: playFlowScheme as TObjectType<unknown>,
    PlaySequenceData: playSequenceDataScheme as TObjectType<unknown>,
    PlayCustomSequence: playSequenceDataScheme as TObjectType<unknown>,
    SetCameraMode: setCameraModeScheme as TObjectType<unknown>,
    SetFlowBoolOption: setFlowBoolOptionScheme as TObjectType<unknown>,
    SetPlotMode: setPlotModeScheme as TObjectType<unknown>,
    ShowCenterText: showCenterTextScheme as TObjectType<unknown>,
    ShowMessage: showMssageScheme as TObjectType<unknown>,
    ShowOption: showOptionScheme as TObjectType<unknown>,
    ShowTalk: showTalkScheme as TObjectType<unknown>,
    Wait: waitScheme as TObjectType<unknown>,
};

actionRegistry.SetupActionMap(actionSchemeMap);

export * from './ActionRegistry';
export * from './Flow';
export * from './Sequence';
