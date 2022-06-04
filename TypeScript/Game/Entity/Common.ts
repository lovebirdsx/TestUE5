/* eslint-disable spellcheck/spell-checker */
import { StateComponent } from '../Component/StateComponent';
import { Entity, gameContext, ITsEntity, parseComponentsData } from '../Interface';

export function initTsEntity(tsEntity: ITsEntity): void {
    const state = gameContext.StateManager.GetState(tsEntity.Id);
    if (state?.Deleted) {
        tsEntity.K2_DestroyActor();
        return;
    }

    const entity = new Entity(tsEntity.ActorLabel, tsEntity.Id, tsEntity);
    const componentsState = parseComponentsData(tsEntity.ComponentsDataJson);
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
