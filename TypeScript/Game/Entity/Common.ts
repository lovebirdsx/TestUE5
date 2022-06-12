/* eslint-disable spellcheck/spell-checker */
import { Actor, Class } from 'ue';

import { isChildOfClass } from '../../Common/Util';
import { StateComponent } from '../Component/StateComponent';
import { Entity, gameContext, ITsEntity } from '../Interface';
import { getClassByEntityType } from '../Interface/Entity';
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

export function isEntity(actor: Actor): boolean {
    return (
        isChildOfClass(actor, entityClass) ||
        isChildOfClass(actor, characterEntityClass) ||
        isChildOfClass(actor, playerClass)
    );
}

export function isPlayer(actor: Actor): boolean {
    return isChildOfClass(actor, playerClass);
}
