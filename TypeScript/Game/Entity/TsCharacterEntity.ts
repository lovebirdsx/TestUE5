/* eslint-disable spellcheck/spell-checker */
import { Character, edit_on_instance } from 'ue';

import { Entity, genEntity, getEntityName, ITsEntity, TComponentClass } from '../Interface';

class TsCharacterEntity extends Character implements ITsEntity {
    @edit_on_instance()
    public Guid: string;

    @edit_on_instance()
    public ComponentsStateJson: string;

    // @no-blueprint
    public Entity: Entity;

    public readonly Name: string = 'Entity';

    // @no-blueprint
    public Init(): void {
        this.Entity = genEntity(this);
        this.Entity.Init();
    }

    // @no-blueprint
    public LoadState(): void {
        this.Entity.LoadState();
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
        throw new Error(`[${getEntityName(this)}]GetComponentClasses not implement`);
    }
}

export default TsCharacterEntity;
