/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Class } from 'ue';

import { isObjChildOfClass } from '../../Common/Misc/Util';
import { Component, gameContext, IInteractCall, ITsEntity } from '../Interface';
import { toVector } from '../Interface/Action';
import { IInteract } from '../Interface/IAction';
import { IStateInfo, IUndergroundComponent } from '../Interface/IComponent';
import { EventComponent } from './EventComponent';
import { StateComponent } from './StateComponent';

const playerClass = Class.Load('/Game/Blueprints/TypeScript/Game/Player/TsPlayer.TsPlayer_C');

export class UndergroundComponent extends Component implements IUndergroundComponent {
    public TestState: number;

    public StateInfo: IStateInfo[];

    public IsRestartPlayer: boolean;

    public DestroyTag: string[];

    private readonly StateMap = new Map<number, IStateInfo>();

    private State: StateComponent;

    private Event: EventComponent;

    private StateId = 1;

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);
        this.Event = this.Entity.GetComponent(EventComponent);
        const call: IInteractCall = {
            Name: 'UndergroundComponent',
            CallBack: (action: IInteract) => {
                this.Activate(action);
            },
        };
        this.Event.RegistryInteract(call);
        for (const state of this.StateInfo) {
            this.StateMap.set(state.StateId, state);
        }
    }

    public Activate(action: IInteract): void {
        if (action.Param) {
            this.StateId = Number(action.Param);
            this.State.SetState('StateId', this.StateId);
        }
    }

    public ReceiveOverlap(other: ITsEntity): void {
        if (isObjChildOfClass(other.Entity.Actor, playerClass)) {
            this.RestartPlayerPos();
        } else {
            //DestroyUnderground
            this.DestroyTag.forEach((tag) => {
                if (other.Entity.Actor.ActorHasTag(tag)) {
                    gameContext.EntityManager.RemoveEntity(other, 'delete');
                }
            });
        }
    }

    public OnStart(): void {
        if (this.TestState === -1) {
            this.StateId = 1;
            return;
        }
        this.RestartPlayerPos();
    }

    public OnLoadState(): void {
        this.StateId = this.TestState ? this.TestState : this.State.GetState<number>('StateId');
        this.StateId = this.StateId ? this.StateId : 1;
    }

    public RestartPlayerPos(): void {
        if (!this.IsRestartPlayer) {
            return;
        }
        const info = this.StateMap.get(this.StateId);
        if (info) {
            const pos = toVector(info.RestartPos);
            const player = gameContext.Player;
            if (player) {
                player.K2_SetActorLocation(pos, false, undefined, false);
            }
        }
    }
}
