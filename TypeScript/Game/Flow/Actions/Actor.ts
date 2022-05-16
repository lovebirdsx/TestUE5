/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/class-literal-property-style */
import { Character, Rotator, Vector } from 'ue';

import { isChildOfClass } from '../../../Common/Class';
import { toVector } from '../../../Common/Interface';
import { ActorStateComponent } from '../../Component/ActorStateComponent';
import { EventComponent } from '../../Component/EventComponent';
import { MoveComponent } from '../../Component/MoveComponent';
import { SimpleComponent } from '../../Component/SimpleComponent';
import TsCharacterEntity from '../../Entity/TsCharacterEntity';
import {
    IChangeActorState,
    IFaceToPos,
    IInteract,
    IMoveToPosA,
    ISetPosA,
    ISimpleMove,
} from '../Action';
import { Action } from '../ActionRunner';

export class ChangeActorStateAction extends Action<IChangeActorState> {
    public Execute(): void {
        const actorStateComponent = this.Entity.GetComponent(ActorStateComponent);
        actorStateComponent.ChangeActorState(this.Data.State);
    }
}

export class SetPosAction extends Action<ISetPosA> {
    public Execute(): void {
        // 如果是Character，则需要将其位置拉高
        const pos = toVector(this.Data.Pos);
        if (isChildOfClass(this.Entity.Actor, TsCharacterEntity)) {
            const charactor = this.Entity.Actor as Character;
            pos.Z += charactor.CapsuleComponent.GetUnscaledCapsuleHalfHeight();
        }
        this.Entity.Actor.K2_SetActorLocationAndRotation(
            pos,
            Rotator.MakeFromEuler(new Vector(0, 0, this.Data.Pos.A)),
            false,
            undefined,
            false,
        );
    }
}

export class MoveToPosAction extends Action<IMoveToPosA> {
    public get IsSchedulable(): boolean {
        return true;
    }

    public async ExecuteSync(): Promise<void> {
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        await moveComponent.MoveToPos(this.Data);
    }

    public Stop(): void {
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        moveComponent.Stop();
    }
}

export class FaceToPosAction extends Action<IFaceToPos> {
    public get IsSchedulable(): boolean {
        return true;
    }

    public async ExecuteSync(): Promise<void> {
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        await moveComponent.FaceToPos(this.Data);
    }

    public Stop(): void {
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        moveComponent.Stop();
    }
}

export class SimpleMoveAction extends Action<ISimpleMove> {
    public Execute(): void {
        const simpleComponent = this.Entity.TryGetComponent(SimpleComponent);
        if (simpleComponent) {
            simpleComponent.SimpleMove(this.Data);
        }
    }
}

export class Activation extends Action<IInteract> {
    public Execute(): void {
        const eventComponent = this.Entity.TryGetComponent(EventComponent);
        if (eventComponent) {
            eventComponent.Activate(this.Data);
        }
    }
}
