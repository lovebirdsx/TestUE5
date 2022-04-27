import { regBlueprintType, TTsClassType } from '../../Common/Class';
import { entityRegistry } from './EntityRegistry';
import TsEntity, { entityComponentClasses } from './TsEntity';
import TsNpc, { npcComponentClasses } from './TsNpc';
import TsTrigger, { triggerComponentClasses } from './TsTrigger';

export enum EBlueprintId {
    Entity,
    Npc,
    Trigger,
}

function makeTsClassPath(basePath: string, name: string, dir?: string): string {
    if (dir) {
        return `${basePath}${dir}/${name}.${name}_C`;
    }
    return `${basePath}${name}.${name}_C`;
}

const ENTITY_BASE_PATH = '/Game/Blueprints/TypeScript/Game/Entity/';

function regEntity(id: EBlueprintId, tsClass: TTsClassType, dir?: string): void {
    const path = makeTsClassPath(ENTITY_BASE_PATH, tsClass.name, dir);
    regBlueprintType(id, path, tsClass);
}

let isInit = false;

export function initEntity(): void {
    if (isInit) {
        return;
    }

    entityRegistry.Register(TsEntity, ...entityComponentClasses);
    entityRegistry.Register(TsNpc, ...npcComponentClasses);
    entityRegistry.Register(TsTrigger, ...triggerComponentClasses);

    regEntity(EBlueprintId.Entity, TsEntity);
    regEntity(EBlueprintId.Npc, TsNpc);
    regEntity(EBlueprintId.Trigger, TsTrigger);

    isInit = true;
}

initEntity();

export * from './TsEntity';
export * from './TsNpc';
export * from './TsTrigger';
