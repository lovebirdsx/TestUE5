/* eslint-disable spellcheck/spell-checker */
import { Character, edit_on_instance } from 'ue';

import { getComponentClassesByEntity } from '../Component/Public';
import { Entity, ITsEntity, TComponentClass } from '../Interface';
import { deInitTsEntity, initTsEntity } from './Common';

export class TsCharacterEntity extends Character implements ITsEntity {
    @edit_on_instance()
    public Id: number;

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
        return getComponentClassesByEntity(this);
    }
}

export default TsCharacterEntity;
