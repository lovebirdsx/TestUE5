/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/class-literal-property-style */
import { ActorStateComponent } from '../../Component/ActorStateComponent';
import { EventComponent } from '../../Component/EventComponent';
import { MoveComponent } from '../../Component/MoveComponent';
import { SimpleComponent } from '../../Component/SimpleComponent';
import {
    IChangeActorState,
    IFaceToPos,
    IInteract,
    IMoveToPosA,
    ISetMoveSpeed,
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
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        moveComponent.SetPosA(this.Data.Pos);
    }
}

export class SetMoveSpeedAction extends Action<ISetMoveSpeed> {
    public Execute(): void {
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        moveComponent.Speed = this.Data.Speed;
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
