/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/class-literal-property-style */
import { ActorStateComponent } from '../../Component/ActorStateComponent';
import { EventComponent } from '../../Component/EventComponent';
import { MoveComponent } from '../../Component/MoveComponent';
import { SimpleComponent } from '../../Component/SimpleComponent';
import { IChangeActorState, IFaceToPos, IInteract, IMoveToPos, ISimpleMove } from '../Action';
import { Action } from '../ActionRunner';

export class ChangeActorStateAction extends Action<IChangeActorState> {
    public Execute(): void {
        const actorStateComponent = this.Entity.GetComponent(ActorStateComponent);
        actorStateComponent.ChangeActorState(this.Data.State);
    }
}

export class MoveToPosAction extends Action<IMoveToPos> {
    public get IsSchedulable(): boolean {
        return true;
    }

    public async ExecuteSync(): Promise<void> {
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        await moveComponent.MoveToPos(this.Data);
    }

    public Stop(): void {
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        moveComponent.StopMove();
    }
}

export class FaceToPosAction extends Action<IFaceToPos> {
    public get IsSchedulable(): boolean {
        return true;
    }

    public get IsStoppable(): boolean {
        return false;
    }

    public async ExecuteSync(): Promise<void> {
        const moveComponent = this.Entity.GetComponent(MoveComponent);
        await moveComponent.FaceToPos(this.Data);
    }
}

export class SimpleMoveAction extends Action<ISimpleMove> {
    public Execute(): void {
        const simpleComponent = this.Entity.GetComponent(SimpleComponent);
        simpleComponent.SimpleMove(this.Data);
    }
}

export class Activation extends Action<IInteract> {
    public Execute(): void {
        const eventComponent = this.Entity.GetComponent(EventComponent);
        eventComponent.Activate(this.Data);
    }
}
