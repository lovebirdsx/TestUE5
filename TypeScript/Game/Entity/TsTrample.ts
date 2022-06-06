/* eslint-disable spellcheck/spell-checker */
import { Actor, HitResult, PrimitiveComponent, Vector } from 'ue';

import { TrampleComponent } from '../Component/TrampleComponent';
import { ITsEntity } from '../Interface';
import { isEntity } from './Common';
import TsEntity from './TsEntity';

class TsTrample extends TsEntity {
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

    public ReceiveHit(
        myComp: PrimitiveComponent,
        other: Actor,
        otherComp: PrimitiveComponent,
        bSelfMoved: boolean,
        hitLocation: Vector,
        hitNormal: Vector,
        normalImpulse: Vector,
        hit: HitResult,
    ): void {
        if (isEntity(other)) {
            const tramplecomponent = this.Entity.TryGetComponent(TrampleComponent);
            if (tramplecomponent) {
                tramplecomponent.EventHit(myComp, otherComp, normalImpulse);
            }
        }
    }
}

export default TsTrample;
