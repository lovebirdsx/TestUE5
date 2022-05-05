/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

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
}

export default TsTrample;
