import TsNpc from '../../../../Game/Entity/TsNpc';
import TsTrigger from '../../../../Game/Entity/TsTrigger';
import { editorEntityRegistry } from './EditorEntityRegistry';
import { npcScheme } from './NpcScheme';
import { triggerScheme } from './TriggerScheme';

editorEntityRegistry.RegScheme(TsTrigger, triggerScheme);
editorEntityRegistry.RegScheme(TsNpc, npcScheme);

export * from './EditorEntityRegistry';
