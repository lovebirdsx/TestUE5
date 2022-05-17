/* eslint-disable spellcheck/spell-checker */
import { Actor, HitResult, PrimitiveComponent, Vector } from 'ue';

import { GrabComponent } from '../Component/GrabComponent';
import { SphereComponent } from '../Component/SphereComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const sphereComponentClasses: TComponentClass[] = [SphereComponent, GrabComponent];

class TsSphereActor extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return sphereComponentClasses;
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
            const spherecomponent = this.Entity.TryGetComponent(SphereComponent);
            if (SphereComponent) {
                spherecomponent.EventHit(myComp, otherComp, hitNormal, normalImpulse);
            }
        }
    }
}

export default TsSphereActor;
