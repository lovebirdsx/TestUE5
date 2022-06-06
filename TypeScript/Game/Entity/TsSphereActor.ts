/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { SphereComponent } from '../Component/SphereComponent';
import { ITsEntity } from '../Interface';
import { isEntity } from './Common';
import TsEntity from './TsEntity';

class TsSphereActor extends TsEntity {
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

    public Interacting(): void {
        const component = this.Entity.TryGetComponent(SphereComponent);
        if (component) {
            component.Interacting();
        }
    }
}

export default TsSphereActor;
