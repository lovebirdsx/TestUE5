/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import * as UE from 'ue';

import { regBlueprintType, TTsClassType } from '../../Common/Class';
import { EBlueprintId } from '../Interface';
import TsPlayer, { playerComponentClasses } from '../Player/TsPlayer';
import { entityRegistry } from './EntityRegistry';
import TsAiNpc, { aiNpcComponentClasses } from './TsAiNpc';
import TsCharacterEntity from './TsCharacterEntity';
import TsEntity from './TsEntity';
import TsNpc, { npcComponentClasses } from './TsNpc';
import TsRotator, { rotatorComponentClasses } from './TsRotator';
import TsSphereActor, { sphereComponentClasses } from './TsSphereActor';
import TsSpring, { springComponentClasses } from './TsSpring';
import TsStateEntity, { stateEntityComponentClasses } from './TsStateEntity';
import TsTrample, { trampleComponentClasses } from './TsTrample';
import TsTrigger, { triggerComponentClasses } from './TsTrigger';

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
    regBlueprintType(id, path, tsClass, true);
}

function regPlayer(id: EBlueprintId, tsClass: TTsClassType, dir?: string): void {
    const path = makeTsClassPath(PLAYER_BASE_PATH, tsClass.name, dir);
    regBlueprintType(id, path, tsClass, true);
}

const ENTITY_EXTENDED_PATH = '/Game/Blueprints/ExtendedEntity/';
function regExtendedEntity(
    id: EBlueprintId,
    name: string,
    tsClass: TTsClassType,
    dir?: string,
): void {
    const path = makeTsClassPath(ENTITY_EXTENDED_PATH, name, dir);
    regBlueprintType(id, path, tsClass, false);
}

const ACTOR_COMPONET_PATH = '/Game/Blueprints/Component/';
function regActorComponent(id: EBlueprintId, name: string, dir?: string): void {
    const path = makeTsClassPath(ACTOR_COMPONET_PATH, name, dir);
    regBlueprintType(id, path, UE.ActorComponent, false);
}

let isInit = false;

export function initEntity(): void {
    if (isInit) {
        return;
    }

    // Components
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
    entityRegistry.Register(TsStateEntity, ...stateEntityComponentClasses);

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
    regEntity(EBlueprintId.StateEntity, TsStateEntity);

    // Character Entity
    regEntity(EBlueprintId.CharacterEntity, TsCharacterEntity);
    regEntity(EBlueprintId.AiNpc, TsAiNpc);

    // ExtendedEntity
    regExtendedEntity(EBlueprintId.AiNpcGuard1, 'BP_AiNpcGuard1', TsAiNpc);
    regExtendedEntity(EBlueprintId.AiNpcGuard2, 'BP_AiNpcGuard2', TsAiNpc);
    regExtendedEntity(EBlueprintId.AiNpcAj, 'BP_AiNpcAj', TsAiNpc);
    regExtendedEntity(EBlueprintId.AiNpcMother, 'BP_AiNpcMother', TsAiNpc);
    regExtendedEntity(EBlueprintId.AiNpcVillageHead, 'BP_AiNpcVillageHead', TsAiNpc);
    regExtendedEntity(EBlueprintId.AiNpcVillage1, 'BP_AiNpcVillage1', TsAiNpc);
    regExtendedEntity(EBlueprintId.AiNpcVillage2, 'BP_AiNpcVillage2', TsAiNpc);
    regExtendedEntity(EBlueprintId.Gate, 'BP_Gate', TsStateEntity);

    // ActorComponent
    regActorComponent(EBlueprintId.ActorStateComponent, 'BP_StateComponent');

    isInit = true;
}

initEntity();

export * from './TsEntity';
export * from './TsNpc';
export * from './TsRotator';
export * from './TsSphereActor';
export * from './TsSpring';
export * from './TsTrample';
export * from './TsTrigger';
