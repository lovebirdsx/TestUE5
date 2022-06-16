/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { ITsEntity } from '../Interface';
import { isEntity } from '../Interface/Entity';
import TsEntity from './TsEntity';

export class TsNpc extends TsEntity {
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

export default TsNpc;
