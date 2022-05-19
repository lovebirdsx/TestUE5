/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { EntitySpawnerComponent } from '../Component/EntitySpawnerComponent';
import { StateComponent } from '../Component/StateComponent';
import { TriggerComponent } from '../Component/TriggerComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const triggerComponentClasses: TComponentClass[] = [
    StateComponent,
    TriggerComponent,
    EntitySpawnerComponent,
];

export class TsTrigger extends TsEntity {
    public GetComponentClasses(): TComponentClass[] {
        return triggerComponentClasses;
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
}

export default TsTrigger;
