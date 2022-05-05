/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

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

export default TsSpring;
