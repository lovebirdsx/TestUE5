/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { ActionRunnerComponent } from '../Component/ActionRunnerComponent';
import { BehaviorFlowComponent } from '../Component/BehaviorFlowComponent';
import { EntitySpawnerComponent } from '../Component/EntitySpawnerComponent';
import { FlowComponent } from '../Component/FlowComponent';
import MoveComponent from '../Component/MoveComponent';
import { NpcComponent } from '../Component/NpcComponent';
import StateComponent from '../Component/StateComponent';
import { TalkComponent } from '../Component/TalkComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsCharacterEntity from './TsCharacterEntity';

export const aiNpcComponentClasses: TComponentClass[] = [
    StateComponent,
    FlowComponent,
    BehaviorFlowComponent,
    TalkComponent,
    ActionRunnerComponent,
    MoveComponent,
    NpcComponent,
    EntitySpawnerComponent,
];

class TsAiNpc extends TsCharacterEntity {
    public GetComponentClasses(): TComponentClass[] {
        return aiNpcComponentClasses;
    }

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
