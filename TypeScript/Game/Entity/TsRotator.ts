/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { RotatorComponent } from '../Component/RotatorComponent';
import { ITsEntity, TComponentClass } from '../Interface';
import { isEntity } from './EntityRegistry';
import TsEntity from './TsEntity';

export const rotatorComponentClasses: TComponentClass[] = [RotatorComponent];

class TsRotator extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return rotatorComponentClasses;
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

    public Jump(): void {}

    public SpeedUp(): void {}

    public SpeedDown(): void {}

    public ResetSpeed(): void {}

    public RotateX(val: number): void {
        const component = this.Entity.TryGetComponent(RotatorComponent);
        if (component) {
            component.RotateX(val);
        }
    }

    public RotateY(val: number): void {
        const component = this.Entity.TryGetComponent(RotatorComponent);
        if (component) {
            component.RotateY(val);
        }
    }
}

export default TsRotator;
