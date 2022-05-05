import { regBlueprintType, TTsClassType } from '../../Common/Class';
import TsPlayer, { playerComponentClasses } from '../Player/TsPlayer';
import { entityRegistry } from './EntityRegistry';
import TsAiNpc, { aiNpcComponentClasses } from './TsAiNpc';
import TsCharacterEntity from './TsCharacterEntity';
import TsEntity from './TsEntity';
import TsMoveMesh, { moveMeshComponentClasses } from './TsMoveMesh';
import TsNpc, { npcComponentClasses } from './TsNpc';
import TsRotator, { rotatorComponentClasses } from './TsRotator';
import TsSphereActor, { sphereComponentClasses } from './TsSphereActor';
import TsSpring, { springComponentClasses } from './TsSpring';
import TsTrample, { trampleComponentClasses } from './TsTrample';
import TsTrigger, { triggerComponentClasses } from './TsTrigger';

// 注意: 由于序列化中会用到Entity的Id,故而新增类型不能改变已有id
export enum EBlueprintId {
    Entity = 0,
    Npc = 1,
    Trigger = 2,
    Player = 3,
    TsSphereActor = 4,
    CharacterEntity = 5,
    AiNpc = 6,
    Spring = 7,
    Rotator = 8,
    Trample = 9,
    MoveMesh = 10,
}

function makeTsClassPath(basePath: string, name: string, dir?: string): string {
    if (dir) {
        return `${basePath}${dir}/${name}.${name}_C`;
    }
    return `${basePath}${name}.${name}_C`;
}

const ENTITY_BASE_PATH = '/Game/Blueprints/TypeScript/Game/Entity/';
const PLAYER_BASE_PATH = '/Game/Blueprints/TypeScript/Game/Player/';

function regEntity(id: EBlueprintId, tsClass: TTsClassType, dir?: string): void {
    const path = makeTsClassPath(ENTITY_BASE_PATH, tsClass.name, dir);
    regBlueprintType(id, path, tsClass);
}

function regPlayer(id: EBlueprintId, tsClass: TTsClassType, dir?: string): void {
    const path = makeTsClassPath(PLAYER_BASE_PATH, tsClass.name, dir);
    regBlueprintType(id, path, tsClass);
}

let isInit = false;

export function initEntity(): void {
    if (isInit) {
        return;
    }

    entityRegistry.Register(TsEntity);
    entityRegistry.Register(TsCharacterEntity);
    entityRegistry.Register(TsNpc, ...npcComponentClasses);
    entityRegistry.Register(TsTrigger, ...triggerComponentClasses);
    entityRegistry.Register(TsPlayer, ...playerComponentClasses);
    entityRegistry.Register(TsSphereActor, ...sphereComponentClasses);
    entityRegistry.Register(TsAiNpc, ...aiNpcComponentClasses);
    entityRegistry.Register(TsSpring, ...springComponentClasses);
    entityRegistry.Register(TsRotator, ...rotatorComponentClasses);
    entityRegistry.Register(TsTrample, ...trampleComponentClasses);
    entityRegistry.Register(TsMoveMesh, ...moveMeshComponentClasses);

    // Player
    regPlayer(EBlueprintId.Player, TsPlayer);

    // Entity
    regEntity(EBlueprintId.Entity, TsEntity);
    regEntity(EBlueprintId.Npc, TsNpc);
    regEntity(EBlueprintId.Trigger, TsTrigger);
    regEntity(EBlueprintId.TsSphereActor, TsSphereActor);
    regEntity(EBlueprintId.Spring, TsSpring);
    regEntity(EBlueprintId.Rotator, TsRotator);
    regEntity(EBlueprintId.Trample, TsTrample);
    regEntity(EBlueprintId.MoveMesh, TsMoveMesh);

    // Character Entity
    regEntity(EBlueprintId.CharacterEntity, TsCharacterEntity);
    regEntity(EBlueprintId.AiNpc, TsAiNpc);

    isInit = true;
}

initEntity();

export * from './TsEntity';
export * from './TsMoveMesh';
export * from './TsNpc';
export * from './TsRotator';
export * from './TsSphereActor';
export * from './TsSpring';
export * from './TsTrample';
export * from './TsTrigger';
