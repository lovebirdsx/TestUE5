import { regBlueprintType } from '../../Common/Class';
import { entityRegistry } from './EntityRegistry';
import TsEntity, { entityComponentClasses } from './TsEntity';
import TsNpc, { npcComponentClasses } from './TsNpc';
import TsTrigger, { triggerComponentClasses } from './TsTrigger';

entityRegistry.Register(TsEntity, ...entityComponentClasses);
entityRegistry.Register(TsNpc, ...npcComponentClasses);
entityRegistry.Register(TsTrigger, ...triggerComponentClasses);

regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsNpc.TsNpc_C', TsNpc);
regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsTrigger.TsTrigger_C', TsTrigger);
regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsEntity.TsEntity_C', TsEntity);

export * from './EntityRegistry';
export * from './TsEntity';
export * from './TsNpc';
export * from './TsTrigger';
