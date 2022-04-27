import TsNpc from '../../Entity/TsNpc';
import TsTrigger from '../../Entity/TsTrigger';
import { entitySchemeRegistry } from './EntitySchemeRegistry';
import { npcScheme } from './NpcScheme';
import { triggerScheme } from './TriggerScheme';

entitySchemeRegistry.RegScheme(TsTrigger, triggerScheme);
entitySchemeRegistry.RegScheme(TsNpc, npcScheme);

export * from './EntitySchemeRegistry';
