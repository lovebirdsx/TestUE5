/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { RotatorComponent } from '../Component/RotatorComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const rotatorComponentClasses: TComponentClass[] = [RotatorComponent];

class TsRotator extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return rotatorComponentClasses;
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

export default TsRotator;
