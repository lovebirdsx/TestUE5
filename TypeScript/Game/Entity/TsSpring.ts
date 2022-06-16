/* eslint-disable spellcheck/spell-checker */
import { Actor, HitResult, PrimitiveComponent, Vector } from 'ue';

import { isEntity } from '../../Common/Interface/Entity';
import { SpringComponent } from '../Component/SpringComponent';
import { ITsEntity } from '../Interface';
import TsEntity from './TsEntity';

class TsSpring extends TsEntity {
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
            const springcomponent = this.Entity.TryGetComponent(SpringComponent);
            if (springcomponent) {
                springcomponent.EventHit(myComp, otherComp, hitNormal, normalImpulse);
            }
        }
    }
}

export default TsSpring;
