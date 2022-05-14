/* eslint-disable @typescript-eslint/no-use-before-define */
import { Game } from 'ue';
import BP_StateComponent = Game.Blueprints.Component.BP_StateComponent.BP_StateComponent_C;

import { getBlueprintClass } from '../../Common/Class';
import { TActorState } from '../Flow/Action';
import { Component, EBlueprintId, IActorStateComponent } from '../Interface';
import { StateComponent } from './StateComponent';

const DEFAULT_ACTOR_STATE: TActorState = 'Idle';

export class ActorStateComponent extends Component implements IActorStateComponent {
    private ActorStateComponent: BP_StateComponent;

    private StateComponent: StateComponent;

    public get State(): TActorState {
        return this.StateComponent.GetState('ActorState') || DEFAULT_ACTOR_STATE;
    }

    public set State(state: TActorState) {
        this.ActorStateComponent.Change('ActorState', state);
        this.StateComponent.SetState(
            'ActorState',
            state !== DEFAULT_ACTOR_STATE ? state : undefined,
        );
    }

    public OnInit(): void {
        this.StateComponent = this.Entity.GetComponent(StateComponent);
        this.ActorStateComponent = this.Entity.Actor.GetComponentByClass(
            getBlueprintClass(EBlueprintId.ActorStateComponent),
        ) as BP_StateComponent;
    }

    public OnLoadState(): void {
        this.ActorStateComponent.Set('ActorState', this.State);
    }

    public ChangeActorState(state: TActorState): void {
        this.State = state;
    }
}
