/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, KismetMathLibrary, PrimitiveComponent, Rotator, Vector } from 'ue';

import { Component, gameContext, ITickable } from '../Interface';
import { IVectorInfo } from '../Interface/IAction';
import { IGrabComponent } from '../Interface/IComponent';
import TsPlayer from '../Player/TsPlayer';

export class GrabComponent extends Component implements IGrabComponent, ITickable {
    public GrabPos: IVectorInfo;

    public ThrowHight: number;

    public ThrowPow: number;

    private GrabActor: Actor;

    public OnInit(): void {
        this.GrabActor = undefined;
    }

    public OnLoadState(): void {}

    public OnStart(): void {}

    public OnDestroy(): void {}

    public Grab(actor: Actor): void {
        if (this.GrabActor !== undefined) {
            this.CleanGrab();
        }
        this.GrabActor = actor;
        const player = gameContext.Player as TsPlayer;
        player.SetGrab(actor);
        gameContext.TickManager.AddTick(this);
    }

    public CleanGrab(): void {
        gameContext.TickManager.RemoveTick(this);
        this.GrabActor = undefined;
        const player = gameContext.Player as TsPlayer;
        player.SetGrab(undefined);
    }

    public ReleaseGrab(): void {
        if (this.GrabActor) {
            const component = this.GrabActor.GetComponentByClass(
                PrimitiveComponent.StaticClass(),
            ) as PrimitiveComponent;
            const player = gameContext.Player as TsPlayer;
            const forward = player
                .GetActorForwardVector()
                .op_Multiply(this.ThrowPow)
                .op_Addition(new Vector(0, 0, this.ThrowHight));
            component.SetAllPhysicsLinearVelocity(forward);
        }
        this.CleanGrab();
    }

    public Tick(deltaTime: number): void {
        this.UpdateGradPos();
    }

    public UpdateGradPos(): void {
        if (this.GrabActor === undefined) {
            return;
        }
        const player = gameContext.Player as TsPlayer;
        const grab = player.Grab;
        const component = grab.GetGrabbedComponent();
        if (component) {
            const transform = player.GetTransform();
            const vector = KismetMathLibrary.TransformLocation(
                transform,
                new Vector(this.GrabPos.X, this.GrabPos.Y, this.GrabPos.Z),
            );
            const rotation: Rotator = player.K2_GetActorRotation();
            //grab.SetTargetLocationAndRotation(vector, rotation);
            component.K2_SetWorldLocationAndRotation(vector, rotation, false, undefined, false);
        }
    }
}
