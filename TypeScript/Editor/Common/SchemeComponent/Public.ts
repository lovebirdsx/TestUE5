/* eslint-disable spellcheck/spell-checker */
import { IPlayFlow, IShowTalk } from '../../../Game/Flow/Action';
import { playFlowScheme } from '../Scheme/Action/Flow';
import { jumpIdScheme } from '../Scheme/Action/JumpTalk';
import { whoIdsScheme } from '../Scheme/Action/Sequence';
import {
    showTalkScheme,
    talkerIdScheme,
    talkItemNameScheme,
    talkItemTextIdScheme,
    talkOptionTextIdScheme,
} from '../Scheme/Action/ShowTalk';
import { centerTextIdScheme } from '../Scheme/Action/ShowText';
import { stateIdScheme } from '../Scheme/Action/State';
import { csvFollowCellScheme } from '../Scheme/Csv/CsvCell';
import { playFlowJsonScheme } from '../Scheme/Entity/NpcScheme';
import { actionsJsonScheme } from '../Scheme/Entity/TriggerScheme';
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
