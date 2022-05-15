/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { EventComponent } from '../Component/EventComponent';
import { GameModeComponent } from '../Component/GameModeComponent';
import { StateComponent } from '../Component/StateComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const gameModeComponentClasses: TComponentClass[] = [
    GameModeComponent,
    StateComponent,
    EventComponent,
];

class TsGameMode extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return gameModeComponentClasses;
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (isEntity(other)) {
            const tsEntity = other as ITsEntity;
            const component = this.Entity.TryGetComponent(GameModeComponent);
            if (component) {
                component.ReceiveOverlap(tsEntity);
            }
        }
    }
}

export default TsGameMode;
