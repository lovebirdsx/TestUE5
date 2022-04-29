/* eslint-disable no-void */
import { Actor } from 'ue';

import { ActionRunnerComponent } from '../Component/ActionRunnerComponent';
import StateComponent from '../Component/StateComponent';
import { TriggerComponent } from '../Component/TriggerComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const triggerComponentClasses: TComponentClass[] = [
    StateComponent,
    ActionRunnerComponent,
    TriggerComponent,
];

export class TsTrigger extends TsEntity {
    public GetComponentClasses(): TComponentClass[] {
        return triggerComponentClasses;
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (isEntity(other)) {
            const tsEntity = other as ITsEntity;
            this.Entity.OnTriggerEnter(tsEntity.Entity);
        }
    }
}

export default TsTrigger;
