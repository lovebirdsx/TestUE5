/* eslint-disable spellcheck/spell-checker */
import { IPlayFlow, IShowTalk } from '../../../Game/Flow/Action';
import { playFlowScheme } from '../../../Game/Scheme/Action/Flow';
import { jumpIdScheme } from '../../../Game/Scheme/Action/JumpTalk';
import { whoIdsScheme } from '../../../Game/Scheme/Action/Sequence';
import {
    showTalkScheme,
    talkerIdScheme,
    talkItemNameScheme,
    talkItemTextIdScheme,
    talkOptionTextIdScheme,
} from '../../../Game/Scheme/Action/ShowTalk';
import { centerTextIdScheme } from '../../../Game/Scheme/Action/ShowText';
import { stateIdScheme } from '../../../Game/Scheme/Action/State';
import { csvFollowCellScheme } from '../../../Game/Scheme/Csv/CsvCell';
import { playFlowJsonScheme } from '../../../Game/Scheme/Entity/NpcScheme';
import { actionsJsonScheme } from '../../../Game/Scheme/Entity/TriggerScheme';
import { RenderCsvFollowCell } from './Extend/Csv';
import { RenderActionJson, RenderPlayFlow, RenderPlayFlowJson, RenderStateId } from './Extend/Flow';
import { RenderWhoIdsScheme } from './Extend/Sequence';
import {
    RenderJumpTalkId,
    RenderShowTalk,
    RenderTalkerIdScheme,
    RenderTalkItemName,
    RenderTextId,
} from './Extend/Talk';
import { renderRegistry } from './RenderRegistry';

renderRegistry.RegComponent<number>(jumpIdScheme, RenderJumpTalkId);
renderRegistry.RegComponent<number>(stateIdScheme, RenderStateId);
renderRegistry.RegComponent<number>(talkOptionTextIdScheme, RenderTextId);
renderRegistry.RegComponent<number>(talkItemTextIdScheme, RenderTextId);
renderRegistry.RegComponent<number>(centerTextIdScheme, RenderTextId);
renderRegistry.RegComponent<number>(talkerIdScheme, RenderTalkerIdScheme);
renderRegistry.RegComponent<string>(talkItemNameScheme, RenderTalkItemName);
renderRegistry.RegComponent<string>(csvFollowCellScheme, RenderCsvFollowCell);
renderRegistry.RegComponent<string>(playFlowJsonScheme, RenderPlayFlowJson);
renderRegistry.RegComponent<string>(actionsJsonScheme, RenderActionJson);
renderRegistry.RegObjComponent<IShowTalk>(showTalkScheme, RenderShowTalk);
renderRegistry.RegComponent<IPlayFlow>(playFlowScheme, RenderPlayFlow);

renderRegistry.RegComponent<number[]>(whoIdsScheme, RenderWhoIdsScheme);

export * from './Basic/Public';
