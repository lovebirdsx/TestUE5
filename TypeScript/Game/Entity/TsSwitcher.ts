/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { isEntity } from '../../UniverseEditor/Common/Interface/Entity';
import { ITsEntity } from '../Interface';
import TsEntity from './TsEntity';

export class TsSwitcher extends TsEntity {
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
}

export default TsSwitcher;
