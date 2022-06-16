/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { RotatorComponent } from '../Component/RotatorComponent';
import { ITsEntity } from '../Interface';
import { isEntity } from '../Interface/Entity';
import TsEntity from './TsEntity';

class TsRotator extends TsEntity {
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

    public RotateZ(val: number): void {
        const component = this.Entity.TryGetComponent(RotatorComponent);
        if (component) {
            component.RotateZ(val);
        }
    }

    public Interacting(): void {
        const component = this.Entity.TryGetComponent(RotatorComponent);
        if (component) {
            component.Interacting();
        }
    }
}

export default TsRotator;
