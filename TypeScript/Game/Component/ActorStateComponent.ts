/* eslint-disable @typescript-eslint/no-use-before-define */
import { Game } from 'ue';
import BP_StateComponent = Game.Blueprints.Component.BP_StateComponent.BP_StateComponent_C;

import { getBlueprintClass } from '../../Common/Class';
import { TActorState } from '../Flow/Action';
import { Component, EBlueprintId, IActorStateComponent } from '../Interface';
import { StateComponent } from './StateComponent';

export class ActorStateComponent extends Component implements IActorStateComponent {
    public readonly InitState: TActorState;

    private ActorStateComponent: BP_StateComponent;

    private StateComponent: StateComponent;

    public OnInit(): void {
        this.StateComponent = this.Entity.GetComponent(StateComponent);
        this.ActorStateComponent = this.Entity.Actor.GetComponentByClass(
            getBlueprintClass(EBlueprintId.ActorStateComponent),
        ) as BP_StateComponent;
    }

    public OnLoadState(): void {
        this.ActorStateComponent.Set('ActorState', this.State);
    }

    public get State(): TActorState {
        return this.StateComponent.GetState('ActorState') || this.InitState;
    }

    public set State(state: TActorState) {
        this.ActorStateComponent.Change('ActorState', state);
        this.StateComponent.SetState('ActorState', state !== this.InitState ? state : undefined);
    }

    public SetNumberValue(name: string, value: number): void {
        this.ActorStateComponent.Change(name, value.toString());
    }

    public ChangeActorState(state: TActorState): void {
        this.State = state;
    }
}
