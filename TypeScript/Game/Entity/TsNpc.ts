/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { ActionRunnerComponent } from '../Component/ActionRunnerComponent';
import { FlowComponent } from '../Component/FlowComponent';
import { NpcComponent } from '../Component/NpcComponent';
import StateComponent from '../Component/StateComponent';
import { TalkComponent } from '../Component/TalkComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const npcComponentClasses: TComponentClass[] = [
    StateComponent,
    FlowComponent,
    TalkComponent,
    ActionRunnerComponent,
    NpcComponent,
];

export class TsNpc extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return npcComponentClasses;
    }

    public readonly Name: string = 'Npc';

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

export default TsNpc;
