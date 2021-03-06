/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { isEntity } from '../../UniverseEditor/Common/Interface/Entity';
import { ITsEntity } from '../Interface';
import TsCharacterEntity from './TsCharacterEntity';

class TsAiNpc extends TsCharacterEntity {
    public ReceiveActorBeginOverlap(other: Actor): void {
        if (!this.Entity) {
            return;
        }

        if (isEntity(other)) {
            const tsEntity = other as ITsEntity;
            if (tsEntity.Entity) {
                this.Entity.OnTriggerEnter(tsEntity.Entity);
            }
        }
    }

    public ReceiveActorEndOverlap(other: Actor): void {
        if (isEntity(other)) {
            const tsEntity = other as ITsEntity;
            this.Entity.OnTriggerExit(tsEntity.Entity);
        }
    }
}

export default TsAiNpc;
