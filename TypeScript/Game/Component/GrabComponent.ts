/* eslint-disable no-await-in-loop */
/* eslint-disable spellcheck/spell-checker */

import { Actor, Rotator, Vector } from 'ue';

import { log } from '../../Common/Log';
import { Component, gameContext, ITickable } from '../Interface';
import TsPlayer from '../Player/TsPlayer';

export interface IGrabSetting {
    Position: Vector;
}

export interface IGrabInfo {
    Actor: Actor;
    Setting: IGrabSetting;
}

export class GrabComponent extends Component {
    private GrabInfo: IGrabInfo;

    private GrabTick: ITickable;

    public OnInit(): void {
        const setting = { Position: new Vector(0, 0, 0) };
        this.GrabInfo = { Actor: null, Setting: setting };
    }

    public OnLoad(): void {}

    public OnStart(): void {}

    public OnDestroy(): void {
        this.ReleaseGrab();
    }

    public Grab(actor: Actor, info: IGrabSetting): void {
        if (this.GrabInfo.Actor !== null) {
            this.ReleaseGrab();
        }
        log('set grab');
        this.GrabInfo.Actor = actor;
        this.GrabInfo.Setting = info;
        const player = gameContext.Player as TsPlayer;
        player.SetGrab(actor);
        this.GrabTick = {
            Name: player.Name + `Grab` + actor.GetName(),
            Tick: (): void => {
                this.UpdateGradPos();
            },
        };
        gameContext.TickManager.AddTick(this.GrabTick);
    }

    public ReleaseGrab(): void {
        gameContext.TickManager.RemoveTick(this.GrabTick);
        this.GrabInfo.Actor = null;
        this.GrabInfo.Setting = null;
        const player = gameContext.Player as TsPlayer;
        player.SetGrab(null);
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
            const vector = playerVector.op_Addition(this.GrabInfo.Setting.Position);
            const rotation: Rotator = player.K2_GetActorRotation();
            grab.SetTargetLocationAndRotation(vector, rotation);
        }
    }
}
