/* eslint-disable spellcheck/spell-checker */
import { Actor, HitResult, PrimitiveComponent, Vector } from 'ue';

import { SpringComponent } from '../Component/SpringComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const springComponentClasses: TComponentClass[] = [SpringComponent];

class TsSpring extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return springComponentClasses;
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
