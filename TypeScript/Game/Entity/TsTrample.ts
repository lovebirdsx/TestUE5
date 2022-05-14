/* eslint-disable spellcheck/spell-checker */
import { Actor, HitResult, PrimitiveComponent, Vector } from 'ue';

import { TrampleComponent } from '../Component/TrampleComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const trampleComponentClasses: TComponentClass[] = [TrampleComponent];

class TsTrample extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return trampleComponentClasses;
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
            const tramplecomponent = this.Entity.TryGetComponent(TrampleComponent);
            if (tramplecomponent) {
                tramplecomponent.EventHit(myComp, otherComp, normalImpulse);
            }
        }
    }
}

export default TsTrample;
