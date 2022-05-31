/* eslint-disable spellcheck/spell-checker */
import { Actor, edit_on_instance } from 'ue';

import { Entity, ITsEntity, TComponentClass } from '../Interface';
import { deInitTsEntity, initTsEntity } from './Common';

export class TsEntity extends Actor implements ITsEntity {
    @edit_on_instance()
    public Guid: string;

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
        return [];
    }
}

export default TsEntity;
