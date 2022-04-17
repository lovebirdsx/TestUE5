import { TTsClassType } from '../../Common/Class';
import { Component } from '../../Common/Entity';
import { error } from '../../Common/Log';

export type TComponentClass = new () => Component;

class EntityRegistry {
    private readonly EntityMap = new Map<TTsClassType, TComponentClass[]>();

    public Register(entityClass: TTsClassType, ...components: TComponentClass[]): void {
        this.EntityMap.set(entityClass, components);
    }

    public GetComponents(entityClass: TTsClassType): TComponentClass[] {
        const result = this.EntityMap.get(entityClass);
        if (!result) {
            error(`No components class for [${entityClass.name}]`);
        }
        return result;
    }
}

export const entityRegistry = new EntityRegistry();
