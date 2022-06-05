/* eslint-disable spellcheck/spell-checker */
import { IVectorInfo } from '../../../Common/Interface';
import {
    IInvoke,
    IPlayFlow,
    IShowTalk,
    ISpawn,
    ITriggerActions,
    TVar,
} from '../../../Game/Interface/Action';
import { IBehaviorFlowComponent, ITempleGuid } from '../../../Game/Interface/Component';
import { varValueScheme } from '../Scheme/Action/Calculate';
import { playFlowScheme } from '../Scheme/Action/Flow';
import { invokeScheme } from '../Scheme/Action/Invoke';
import { jumpIdScheme } from '../Scheme/Action/JumpTalk';
import { dirScheme, posScheme } from '../Scheme/Action/Move';
import { whoIdsScheme } from '../Scheme/Action/Sequence';
import {
    showTalkScheme,
    talkerIdScheme,
    talkItemNameScheme,
    talkItemTextIdScheme,
    talkOptionTextIdScheme,
} from '../Scheme/Action/ShowTalk';
import { centerTextIdScheme } from '../Scheme/Action/ShowText';
import { spawnChildScheme } from '../Scheme/Action/Spawn';
import { stateIdScheme } from '../Scheme/Action/State';
import { behaviorFlowComponentScheme } from '../Scheme/Component/FlowComponentScheme';
import { templeGuidScheme } from '../Scheme/Component/RefreshComponentScheme';
import { triggerActionsScheme } from '../Scheme/Component/TriggerComponentSheme';
import { csvFollowCellScheme } from '../Scheme/Csv/CsvCell';
import { RenderVarValue } from './Extend/Calculate';
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
import { TempleData } from './Extend/TempleData';
import { renderRegistry } from './RenderRegistry';

renderRegistry.RegComponent<number>(jumpIdScheme, RenderJumpTalkId);
renderRegistry.RegComponent<number>(stateIdScheme, RenderStateId);
renderRegistry.RegComponent<number>(talkOptionTextIdScheme, RenderTextId);
renderRegistry.RegComponent<number>(talkItemTextIdScheme, RenderTextId);
renderRegistry.RegComponent<number>(centerTextIdScheme, RenderTextId);
renderRegistry.RegComponent<number>(talkerIdScheme, RenderTalkerIdScheme);
renderRegistry.RegComponent<TVar>(varValueScheme, RenderVarValue);
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
renderRegistry.RegComponent<ITempleGuid>(templeGuidScheme, TempleData);
renderRegistry.RegComponent<number[]>(whoIdsScheme, RenderWhoIdsScheme);

export * from './Basic/Public';
export * from './Extend/FlowList';
export * from './RenderRegistry';
