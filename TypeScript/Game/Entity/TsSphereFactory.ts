/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { EntitySpawnerComponent } from '../Component/EntitySpawnerComponent';
import { SphereFactoryComponent } from '../Component/SphereFactoryComponent';
import { InteractiveComponent, ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const sphereFactoryComponentClasses: TComponentClass[] = [
    SphereFactoryComponent,
    EntitySpawnerComponent,
    InteractiveComponent,
];

class TsSphereFactory extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return sphereFactoryComponentClasses;
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
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

export default TsSphereFactory;
