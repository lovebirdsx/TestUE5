/* eslint-disable spellcheck/spell-checker */
import { IVectorInfo } from '../../../Common/Interface';
import { IInvoke, IPlayFlow, IShowTalk, ISpawn, ITriggerActions } from '../../../Game/Flow/Action';
import { IBehaviorFlowComponent } from '../../../Game/Interface';
import { playFlowScheme } from '../../../Game/Scheme/Action/Flow';
import { invokeScheme } from '../../../Game/Scheme/Action/Invoke';
import { jumpIdScheme } from '../../../Game/Scheme/Action/JumpTalk';
import { dirScheme, posScheme } from '../../../Game/Scheme/Action/Move';
import { whoIdsScheme } from '../../../Game/Scheme/Action/Sequence';
import {
    showTalkScheme,
    talkerIdScheme,
    talkItemNameScheme,
    talkItemTextIdScheme,
    talkOptionTextIdScheme,
} from '../../../Game/Scheme/Action/ShowTalk';
import { centerTextIdScheme } from '../../../Game/Scheme/Action/ShowText';
import { spawnChildScheme } from '../../../Game/Scheme/Action/Spawn';
import { stateIdScheme } from '../../../Game/Scheme/Action/State';
import { behaviorFlowComponentScheme } from '../../../Game/Scheme/Component/FlowComponentScheme';
import { triggerActionsScheme } from '../../../Game/Scheme/Component/TriggerComponentSheme';
import { csvFollowCellScheme } from '../../../Game/Scheme/Csv/CsvCell';
import { RenderCsvFollowCell } from './Extend/Csv';
import { Direction } from './Extend/Direction';
import {
    RenderBehaviorFlow,
    RenderInvoke,
    RenderPlayFlow,
    RenderStateId,
    RenderTriggerActions,
} from './Extend/FlowExtend';
import { Point } from './Extend/Point';
import { RenderWhoIdsScheme } from './Extend/Sequence';
import { Spawn } from './Extend/Spawn';
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
renderRegistry.RegComponent<ITriggerActions>(triggerActionsScheme, RenderTriggerActions);
renderRegistry.RegObjComponent<IShowTalk>(showTalkScheme, RenderShowTalk);
renderRegistry.RegComponent<IPlayFlow>(playFlowScheme, RenderPlayFlow);
renderRegistry.RegComponent<IBehaviorFlowComponent>(
    behaviorFlowComponentScheme,
    RenderBehaviorFlow,
);
renderRegistry.RegComponent<IInvoke>(invokeScheme, RenderInvoke);
renderRegistry.RegComponent<IVectorInfo>(posScheme, Point);
renderRegistry.RegComponent<IVectorInfo>(dirScheme, Direction);
renderRegistry.RegComponent<ISpawn>(spawnChildScheme, Spawn);

renderRegistry.RegComponent<number[]>(whoIdsScheme, RenderWhoIdsScheme);

export * from './Basic/Public';
export * from './Extend/FlowList';
export * from './RenderRegistry';
