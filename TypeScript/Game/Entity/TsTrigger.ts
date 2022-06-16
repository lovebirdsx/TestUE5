/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { isEntity } from '../../Common/Interface/Entity';
import { ITsEntity } from '../Interface';
import TsEntity from './TsEntity';

export class TsTrigger extends TsEntity {
    public ReceiveActorBeginOverlap(other: Actor): void {
        if (!this.Entity) {
            return;
        }

        if (isEntity(other)) {
            const tsEntity = other as ITsEntity;
            this.Entity.OnTriggerEnter(tsEntity.Entity);
        }
    }
}

export default TsTrigger;
