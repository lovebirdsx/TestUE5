/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { ActorStateComponent } from '../Component/ActorStateComponent';
import { EntitySpawnerComponent } from '../Component/EntitySpawnerComponent';
import { StateComponent } from '../Component/StateComponent';
import { SwitcherComponent } from '../Component/SwitcherComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const switcherComponentClasses: TComponentClass[] = [
    StateComponent,
    ActorStateComponent,
    SwitcherComponent,
    EntitySpawnerComponent,
];

export class TsSwitcher extends TsEntity {
    public GetComponentClasses(): TComponentClass[] {
        return switcherComponentClasses;
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (!this.Entity) {
            return;
        }

        if (isEntity(other)) {
            const tsEntity = other as ITsEntity;
            this.Entity.OnTriggerEnter(tsEntity.Entity);
        }
    }

    public ReceiveActorEndOverlap(other: Actor): void {
        if (isEntity(other)) {
            const tsEntity = other as ITsEntity;
            this.Entity.OnTriggerExit(tsEntity.Entity);
        }
    }
}

export default TsSwitcher;
