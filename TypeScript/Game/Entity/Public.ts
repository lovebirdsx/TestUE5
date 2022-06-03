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
import TsLamp, { lampComponentClasses } from './TsLamp';
import TsNpc, { npcComponentClasses } from './TsNpc';
import TsRefreshEntity, { refreshEntityComponentClasses } from './TsRefreshEntity';
import TsRefreshSingle, { refreshSingleComponentClasses } from './TsRefreshSingle';
import TsRotator, { rotatorComponentClasses } from './TsRotator';
import TsSphereActor, { sphereComponentClasses } from './TsSphereActor';
import TsSphereFactory, { sphereFactoryComponentClasses } from './TsSphereFactory';
import TsSpring, { springComponentClasses } from './TsSpring';
import TsSpringBoard, { springBoardComponentClasses } from './TsSpringBoard';
import TsStateEntity, { stateEntityComponentClasses } from './TsStateEntity';
import TsSwitcher, { switcherComponentClasses } from './TsSwitcher';
import TsTrample, { trampleComponentClasses } from './TsTrample';
import TsTrigger, { triggerComponentClasses } from './TsTrigger';
import TsUnderground, { undergroundComponentClasses } from './TsUnderground';

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
    entityRegistry.Register(TsSwitcher, ...switcherComponentClasses);
    entityRegistry.Register(TsPlayer, ...playerComponentClasses);
    entityRegistry.Register(TsSphereActor, ...sphereComponentClasses);
    entityRegistry.Register(TsAiNpc, ...aiNpcComponentClasses);
    entityRegistry.Register(TsSpring, ...springComponentClasses);
    entityRegistry.Register(TsRotator, ...rotatorComponentClasses);
    entityRegistry.Register(TsTrample, ...trampleComponentClasses);
    entityRegistry.Register(TsStateEntity, ...stateEntityComponentClasses);
    entityRegistry.Register(TsSphereFactory, ...sphereFactoryComponentClasses);
    entityRegistry.Register(TsUnderground, ...undergroundComponentClasses);
    entityRegistry.Register(TsLamp, ...lampComponentClasses);
    entityRegistry.Register(TsSpringBoard, ...springBoardComponentClasses);
    entityRegistry.Register(TsRefreshSingle, ...refreshSingleComponentClasses);
    entityRegistry.Register(TsRefreshEntity, ...refreshEntityComponentClasses);

    // Player
    regPlayer(EBlueprintId.Player, TsPlayer);

    // Entity
    regEntity(EBlueprintId.Entity, TsEntity);
    regEntity(EBlueprintId.Npc, TsNpc);
    regEntity(EBlueprintId.Trigger, TsTrigger);
    regEntity(EBlueprintId.Swicher, TsSwitcher);
    regEntity(EBlueprintId.TsSphereActor, TsSphereActor);
    regEntity(EBlueprintId.Spring, TsSpring);
    regEntity(EBlueprintId.Rotator, TsRotator);
    regEntity(EBlueprintId.Trample, TsTrample);
    regEntity(EBlueprintId.StateEntity, TsStateEntity);
    regEntity(EBlueprintId.SphereFactory, TsSphereFactory);
    regEntity(EBlueprintId.Underground, TsUnderground);
    regEntity(EBlueprintId.Lamp, TsLamp);
    regEntity(EBlueprintId.SpringBoard, TsSpringBoard);
    regEntity(EBlueprintId.RefreshSingle, TsRefreshSingle);
    regEntity(EBlueprintId.RefreshEntity, TsRefreshEntity);

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
    regExtendedEntity(EBlueprintId.Invisible, 'BP_Invisible', TsStateEntity);
    regExtendedEntity(EBlueprintId.Screen, 'BP_Screen', TsStateEntity);
    regExtendedEntity(EBlueprintId.SteeringWheel, 'BP_SteeringWheel', TsRotator);
    regExtendedEntity(EBlueprintId.Switcher1, 'BP_Switcher1', TsSwitcher);
    regExtendedEntity(EBlueprintId.Trash, 'BP_Trash', TsSwitcher);
    regExtendedEntity(EBlueprintId.AiNpcTrainer, 'BP_AiNpcTrainer', TsAiNpc);
    regExtendedEntity(EBlueprintId.Mineral, 'BP_Mineral', TsRefreshSingle);
    regExtendedEntity(EBlueprintId.RefreshManage, 'BP_RefreshManage', TsRefreshEntity);

    // ActorComponent
    regActorComponent(EBlueprintId.ActorStateComponent, 'BP_StateComponent');

    isInit = true;
}

initEntity();

export * from './EntityRegistry';
export * from './TsEntity';
export * from './TsLamp';
export * from './TsNpc';
export * from './TsRefreshSingle';
export * from './TsRotator';
export * from './TsSphereActor';
export * from './TsSphereFactory';
export * from './TsSpring';
export * from './TsSpringBoard';
export * from './TsTrample';
export * from './TsTrigger';
export * from './TsUnderground';
