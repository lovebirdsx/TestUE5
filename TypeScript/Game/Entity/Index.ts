import { regBlueprintType } from '../../Common/Class';
import { ActionRunnerComponent } from '../Component/ActionRunnerComponent';
import { FlowComponent } from '../Component/FlowComponent';
import { TalkComponent } from '../Component/TalkComponent';
import { entityRegistry } from './EntityRegistry';
import TsEntity from './TsEntity';
import TsNpc from './TsNpc';
import TsTrigger from './TsTrigger';

entityRegistry.Register(TsEntity);
entityRegistry.Register(TsNpc, FlowComponent, TalkComponent, ActionRunnerComponent);
entityRegistry.Register(TsTrigger, ActionRunnerComponent);

regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsEntity.TsEntity_C', TsEntity);
regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsNpc.TsNpc_C', TsNpc);
regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsTrigger.TsTrigger_C', TsTrigger);

export * from './EntityRegistry';
export * from './TsEntity';
export * from './TsNpc';
export * from './TsTrigger';
