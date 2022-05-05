/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { MoveMeshComponent } from '../Component/TsMoveMeshComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const moveMeshComponentClasses: TComponentClass[] = [MoveMeshComponent];

class TsMoveMesh extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return moveMeshComponentClasses;
    }

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

export default TsMoveMesh;
