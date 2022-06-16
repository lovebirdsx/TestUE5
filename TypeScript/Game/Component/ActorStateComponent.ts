/* eslint-disable @typescript-eslint/no-use-before-define */
import { Class, Game } from 'ue';
import BP_StateComponent = Game.Blueprints.Component.BP_StateComponent.BP_StateComponent_C;

import { TActorState } from '../../Common/Interface/IAction';
import { IActorStateComponent } from '../../Common/Interface/IComponent';
import { Component } from '../Interface';
import { StateComponent } from './StateComponent';

interface IActorStateSlot {
    Key: string;
    Value: string;
}

const actorStateComponentClass = Class.Load(
    '/Game/Blueprints/Component/BP_StateComponent.BP_StateComponent_C',
);

export class ActorStateComponent extends Component implements IActorStateComponent {
    public readonly InitState: TActorState;

    private ActorStateComponent: BP_StateComponent;

    private StateComponent: StateComponent;

    private StateSlots: IActorStateSlot[];

    public OnInit(): void {
        this.StateComponent = this.Entity.GetComponent(StateComponent);
        this.ActorStateComponent = this.Entity.Actor.GetComponentByClass(
            actorStateComponentClass,
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
        this.SetChildStringState(key, value.toString());
    }

    public SetChildStringState(key: string, value: string): void {
        this.ActorStateComponent.Change(key, value);

        // 将状态保存
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

        this.StateComponent.SetState(
            'ActorStateSlots',
            this.StateSlots.length > 0 ? this.StateSlots : undefined,
        );
    }

    public ChangeActorState(state: TActorState): void {
        this.State = state;
    }
}
