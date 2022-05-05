/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, PrimitiveComponent, Rotator, Vector } from 'ue';

import { Component, gameContext, ITickable } from '../Interface';
import TsPlayer from '../Player/TsPlayer';

export interface IGrabSetting {
    GrabPosition: Vector;
    ThrowDir: Vector;
    ThrowSpeed: number;
}

export interface IGrabInfo {
    Actor: Actor;
    Setting: IGrabSetting;
}

export class GrabComponent extends Component {
    private GrabInfo: IGrabInfo;

    private GrabTick: ITickable;

    public OnInit(): void {
        this.GrabInfo = {
            Actor: null,
            Setting: {
                GrabPosition: new Vector(0, 0, 0),
                ThrowDir: new Vector(0, 0, 0),
                ThrowSpeed: 300,
            },
        };
    }

    public OnLoadState(): void {}

    public OnStart(): void {}

    public OnDestroy(): void {
        this.ReleaseGrab();
    }

    public Grab(actor: Actor, info: IGrabSetting): void {
        if (this.GrabInfo.Actor !== null) {
            this.ReleaseGrab();
        }
        this.GrabInfo.Actor = actor;
        this.GrabInfo.Setting = info;
        const player = gameContext.Player as TsPlayer;
        player.SetGrab(actor);
        this.GrabTick = {
            Name: player.GetName() + `Grab` + actor.GetName(),
            Tick: (): void => {
                this.UpdateGradPos();
            },
        };
        gameContext.TickManager.AddTick(this.GrabTick);
    }

    public ReleaseGrab(): void {
        if (this.GrabInfo.Actor !== null) {
            gameContext.TickManager.RemoveTick(this.GrabTick);
            const component = this.GrabInfo.Actor.GetComponentByClass(
                PrimitiveComponent.StaticClass(),
            ) as PrimitiveComponent;
            const player = gameContext.Player as TsPlayer;
            // const offset = this.GrabInfo.Setting.ThrowDir;
            const speed = this.GrabInfo.Setting.ThrowSpeed;
            // TODO scheme 设置
            const forward = player
                .GetActorForwardVector()
                .op_Multiply(speed)
                .op_Addition(new Vector(0, 0, 800));
            component.SetAllPhysicsLinearVelocity(forward);
            this.GrabInfo.Actor = null;
            this.GrabInfo.Setting = null;
            player.SetGrab(null);
        }
    }

    public UpdateGradPos(): void {
        if (this.GrabInfo.Actor === null) {
            return;
        }
        const player = gameContext.Player as TsPlayer;
        const grab = player.Grab;
        const component = grab.GetGrabbedComponent();
        if (component) {
            const playerVector: Vector = player.K2_GetActorLocation();
            // TODO scheme 设置
            const forward = player.GetActorForwardVector().op_Multiply(300);
            // const offset = this.GrabInfo.Setting.GrabPosition;
            const vector = playerVector.op_Addition(forward);
            const rotation: Rotator = player.K2_GetActorRotation();
            grab.SetTargetLocationAndRotation(vector, rotation);
        }
    }
}
