/* eslint-disable spellcheck/spell-checker */
import { Actor, edit_on_instance } from 'ue';

import { Entity, TComponentClass } from '../../Common/Entity';
import { error } from '../../Common/Log';
import { ITsEntity, ITsPlayer, parseComponentsState } from './Interface';

// 没有做成TsEntity的static成员变量，是因为Puerts不支持
export const entityComponentClasses: TComponentClass[] = [];

class TsEntity extends Actor implements ITsEntity {
    @edit_on_instance()
    public ComponentsStateJson: string;

    // @no-blueprint
    public Entity: Entity;

    public get Name(): string {
        return this.GetName();
    }

    public ReceiveBeginPlay(): void {
        if (!this.Entity) {
            this.Entity = this.GenEntity();
            this.Entity.Init();
            this.Entity.Start();
        }
    }

    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return entityComponentClasses;
    }

    // @no-blueprint
    private GenEntity(): Entity {
        const entity = new Entity(this.GetName());
        const componentsState = parseComponentsState(this.ComponentsStateJson);
        const componentClasses = this.GetComponentClasses();
        componentClasses.forEach((componentClass) => {
            const component = entity.AddComponentC(componentClass);
            const data = componentsState.Components[componentClass.name];
            if (data) {
                Object.assign(component, data);
            }
        });
        return entity;
    }

    // @no-blueprint
    public async Interact(player: ITsPlayer): Promise<void> {
        error(`Interact is not implement for ${this.GetName()}`);
        return Promise.resolve();
    }
}

export default TsEntity;
