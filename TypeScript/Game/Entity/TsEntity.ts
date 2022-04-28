/* eslint-disable spellcheck/spell-checker */
import { Actor, edit_on_instance } from 'ue';

import { error } from '../../Common/Log';
import {
    Entity,
    IGameContext,
    ITsEntity,
    ITsPlayer,
    parseComponentsState,
    TComponentClass,
} from '../Interface';

// 没有做成TsEntity的static成员变量，是因为Puerts不支持
export const entityComponentClasses: TComponentClass[] = [];

export class TsEntity extends Actor implements ITsEntity {
    @edit_on_instance()
    public Guid: string;

    @edit_on_instance()
    public ComponentsStateJson: string;

    // @no-blueprint
    public Entity: Entity;

    public get Name(): string {
        return this.GetName();
    }

    // @no-blueprint
    public Init(context: IGameContext): void {
        this.Entity = this.GenEntity(context);
        this.Entity.Init();
    }

    // @no-blueprint
    public Load(): void {
        this.Entity.Load();
    }

    // @no-blueprint
    public Start(): void {
        this.Entity.Start();
    }

    // @no-blueprint
    public Destroy(): void {
        this.Entity.Destroy();
    }

    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return entityComponentClasses;
    }

    // @no-blueprint
    private GenEntity(context: IGameContext): Entity {
        const entity = new Entity(this.GetName(), context);
        const componentsState = parseComponentsState(this.ComponentsStateJson);
        const componentClasses = this.GetComponentClasses();
        componentClasses.forEach((componentClass) => {
            const component = entity.AddComponentC(componentClass);
            const data = componentsState[componentClass.name];
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
