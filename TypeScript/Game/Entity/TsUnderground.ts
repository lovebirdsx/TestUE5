/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { EventComponent } from '../Component/EventComponent';
import { StateComponent } from '../Component/StateComponent';
import { UndergroundComponent } from '../Component/UndergroundComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const undergroundComponentClasses: TComponentClass[] = [
    UndergroundComponent,
    StateComponent,
    EventComponent,
];

class TsUnderground extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return undergroundComponentClasses;
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
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
