/* eslint-disable spellcheck/spell-checker */

import StateComponent from '../Component/StateComponent';
import { Entity, gameContext, ITsEntity, parseComponentsState } from '../Interface';

export function initTsEntity(tsEntity: ITsEntity): void {
    const entity = new Entity(tsEntity.GetName(), tsEntity);
    const componentsState = parseComponentsState(tsEntity.ComponentsStateJson);
    const componentClasses = tsEntity.GetComponentClasses();
    componentClasses.forEach((componentClass) => {
        const component = entity.AddComponentC(componentClass);
        const data = componentsState[componentClass.name];
        if (data) {
            Object.assign(component, data);
        }
    });

    const state = gameContext.StateManager.GetState(tsEntity.Guid);
    if (state) {
        if (state.Deleted) {
            tsEntity.K2_DestroyActor();
            return;
        }

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
    tsEntity.Entity.Destroy();
    gameContext.EntityManager.UnregisterEntity(tsEntity);
}

export function loadTsEntity(tsEntity: ITsEntity): void {
    deInitTsEntity(tsEntity);
    initTsEntity(tsEntity);
}
