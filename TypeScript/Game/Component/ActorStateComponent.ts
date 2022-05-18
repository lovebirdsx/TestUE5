/* eslint-disable @typescript-eslint/no-use-before-define */
import { Game } from 'ue';
import BP_StateComponent = Game.Blueprints.Component.BP_StateComponent.BP_StateComponent_C;

import { getBlueprintClass } from '../../Common/Class';
import { TActorState } from '../Flow/Action';
import { Component, EBlueprintId, IActorStateComponent } from '../Interface';
import { StateComponent } from './StateComponent';

interface IActorStateSlot {
    Key: string;
    Value: string;
}

export class ActorStateComponent extends Component implements IActorStateComponent {
    public readonly InitState: TActorState;

    private ActorStateComponent: BP_StateComponent;

    private StateComponent: StateComponent;

    private StateSlots: IActorStateSlot[];

    public OnInit(): void {
        this.StateComponent = this.Entity.GetComponent(StateComponent);
        this.ActorStateComponent = this.Entity.Actor.GetComponentByClass(
            getBlueprintClass(EBlueprintId.ActorStateComponent),
        ) as BP_StateComponent;
    }

    public OnLoadState(): void {
        this.ActorStateComponent.Set('ActorState', this.State);
        this.StateSlots = this.StateComponent.GetState('ActorStateSlots') || [];
        this.StateSlots.forEach((slot) => {
            this.ActorStateComponent.Set(slot.Key, slot.Value);
        });
    }

    public get State(): TActorState {
        return this.StateComponent.GetState('ActorState') || this.InitState;
    }

    public set State(state: TActorState) {
        this.ActorStateComponent.Change('ActorState', state);
        this.StateComponent.SetState('ActorState', state !== this.InitState ? state : undefined);
    }

    public SetChildNumberState(key: string, value: number): void {
        this.SetChildStringState(key, value === 0 ? undefined : value.toString());
    }

    public SetChildStringState(key: string, value: string): void {
        this.ActorStateComponent.Change(key, value.toString());
        const index = this.StateSlots.findIndex((slot) => slot.Key === key);
        if (!value) {
            if (index >= 0) {
                this.StateSlots.splice(index, 1);
            }
        } else {
            if (index >= 0) {
                this.StateSlots[index].Value = value;
            } else {
                this.StateSlots.push({ Key: key, Value: value });
            }
        }
    }

    public ChangeActorState(state: TActorState): void {
        this.State = state;
    }
}
