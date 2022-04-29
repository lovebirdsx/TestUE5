/* eslint-disable spellcheck/spell-checker */
import { Actor, edit_on_instance } from 'ue';

import { Entity, genEntity, IGameContext, ITsEntity, TComponentClass } from '../Interface';

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
        this.Entity = genEntity(this, context);
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
}

export default TsEntity;
