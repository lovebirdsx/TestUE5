/* eslint-disable spellcheck/spell-checker */
import { Character, edit_on_instance } from 'ue';

import { Entity, getEntityName, ITsEntity, TComponentClass } from '../Interface';
import { deInitTsEntity, initTsEntity } from './Common';

export class TsCharacterEntity extends Character implements ITsEntity {
    @edit_on_instance()
    public Guid: string;

    @edit_on_instance()
    public ComponentsStateJson: string;

    @edit_on_instance()
    public ComponentsDataJson: string;

    // @no-blueprint
    public Entity: Entity;

    public ReceiveBeginPlay(): void {
        this.Init();
    }

    public ReceiveEndPlay(): void {
        this.Destroy();
    }

    // @no-blueprint
    public Init(): void {
        initTsEntity(this);
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
        deInitTsEntity(this);
    }

    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        throw new Error(`[${getEntityName(this)}]GetComponentClasses not implement`);
    }
}

export default TsCharacterEntity;
