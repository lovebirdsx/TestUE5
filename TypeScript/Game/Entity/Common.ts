/* eslint-disable spellcheck/spell-checker */
import { Actor, Class } from 'ue';

import { isChildOfClass, isObjChildOfClass } from '../../Common/Misc/Util';
import { StateComponent } from '../Component/StateComponent';
import { Entity, gameContext, ITsEntity } from '../Interface';
import {
    getClassByEntityType,
    getEntityTypeByActor,
    getEntityTypeByClass,
} from '../Interface/Entity';
import { TComponentsData } from '../Interface/IEntity';

function getComponentsData(entity: ITsEntity, isPlayer: boolean): TComponentsData {
    if (!isPlayer) {
        const entityData = gameContext.LevelDataManager.GetEntityData(entity.Id);
        if (!entityData) {
            throw new Error(`No entityData for id [${entity.Id}:${entity.ActorLabel}]`);
        }
        return entityData.ComponentsData;
    }

    return {};
}

export function initTsEntity(tsEntity: ITsEntity, isPlayer?: boolean): void {
    const state = gameContext.StateManager.GetState(tsEntity.Id);
    if (state?.Deleted) {
        tsEntity.K2_DestroyActor();
        return;
    }

    const entity = new Entity(tsEntity.ActorLabel, isPlayer ? 0 : tsEntity.Id, tsEntity);
    const componentsState = getComponentsData(tsEntity, isPlayer);
    const componentClasses = tsEntity.GetComponentClasses();
    componentClasses.forEach((componentClass) => {
        const data = componentsState[componentClass.name];
        if (!data || !data.Disabled) {
            const component = entity.AddComponentC(componentClass);
            if (data) {
                Object.assign(component, data);
            }
        }
    });

    if (state) {
        const stateComponent = entity.GetComponent(StateComponent);
        stateComponent.ApplySnapshot(state);
    }

    tsEntity.Entity = entity;
    entity.Init();
    gameContext.EntityManager.RegisterEntity(tsEntity);

    tsEntity.LoadState();
    gameContext.TickManager.AddDelayCall(tsEntity.Start.bind(tsEntity));
}

export function deInitTsEntity(tsEntity: ITsEntity): void {
    if (!tsEntity.Entity) {
        return;
    }

    tsEntity.Entity.Destroy();
    gameContext.EntityManager.UnregisterEntity(tsEntity);
}

const entityClass = getClassByEntityType('Entity');
const characterEntityClass = getClassByEntityType('CharacterEntity');
const playerClass = Class.Load('/Game/Blueprints/TypeScript/Game/Player/TsPlayer.TsPlayer_C');

export function isEntityClass(classObj: Class): boolean {
    return (
        isChildOfClass(classObj, entityClass) ||
        isChildOfClass(classObj, characterEntityClass) ||
        isChildOfClass(classObj, playerClass)
    );
}

export function isRegistedEntity(entity: ITsEntity): boolean {
    return getEntityTypeByActor(entity) !== undefined;
}

export function isEntity(actor: Actor): boolean {
    const actorClass = actor.GetClass();
    return isEntityClass(actorClass) && getEntityTypeByClass(actorClass) !== undefined;
}

export function isPlayer(actor: Actor): boolean {
    return isObjChildOfClass(actor, playerClass);
}
