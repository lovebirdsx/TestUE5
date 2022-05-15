/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, KismetMathLibrary, PrimitiveComponent, Rotator, Vector } from 'ue';

import { IVectorType } from '../../Common/Type';
import { Component, gameContext, ITickable } from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import { IGrabComponent } from '../Scheme/Component/GrabComponentScheme';

export class GrabComponent extends Component implements IGrabComponent, ITickable {
    public GrabPos: IVectorType;

    public ThrowHight: number;

    public ThrowPow: number;

    private GrabActor: Actor;

    public OnInit(): void {
        this.GrabActor = null;
    }

    public OnLoadState(): void {}

    public OnStart(): void {}

    public OnDestroy(): void {}

    public Grab(actor: Actor): void {
        if (this.GrabActor !== null) {
            this.CleanGrab();
        }
        this.GrabActor = actor;
        const player = gameContext.Player as TsPlayer;
        player.SetGrab(actor);
        gameContext.TickManager.AddTick(this);
    }

    public CleanGrab(): void {
        gameContext.TickManager.RemoveTick(this);
        this.GrabActor = null;
        const player = gameContext.Player as TsPlayer;
        player.SetGrab(null);
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
        if (this.GrabActor === null) {
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
            component.K2_SetWorldLocationAndRotation(vector, rotation, false, null, false);
        }
    }
}
