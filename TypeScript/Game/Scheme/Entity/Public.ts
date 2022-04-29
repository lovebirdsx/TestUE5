import TsNpc from '../../Entity/TsNpc';
import TsSphereActor from '../../Entity/TsSphereActor';
import TsTrigger from '../../Entity/TsTrigger';
import { entitySchemeRegistry } from './EntitySchemeRegistry';
import { npcScheme } from './NpcScheme';
import { sphereScheme } from './SphereScheme';
import { triggerScheme } from './TriggerScheme';

entitySchemeRegistry.RegScheme(TsTrigger, triggerScheme);
entitySchemeRegistry.RegScheme(TsNpc, npcScheme);
entitySchemeRegistry.RegScheme(TsSphereActor, sphereScheme);

export * from './EntitySchemeRegistry';
