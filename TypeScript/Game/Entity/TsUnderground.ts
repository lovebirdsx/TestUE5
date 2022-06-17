/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { isEntity } from '../../UniverseEditor/Common/Interface/Entity';
import { UndergroundComponent } from '../Component/UndergroundComponent';
import { ITsEntity } from '../Interface';
import TsEntity from './TsEntity';

class TsUnderground extends TsEntity {
    public ReceiveActorBeginOverlap(other: Actor): void {
        if (!this.Entity) {
            return;
        }

        if (isEntity(other)) {
            const tsEntity = other as ITsEntity;
            const component = this.Entity.TryGetComponent(UndergroundComponent);
            if (component) {
                component.ReceiveOverlap(tsEntity);
            }
        }
    }
}

export default TsUnderground;
