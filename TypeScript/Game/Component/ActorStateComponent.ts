/* eslint-disable @typescript-eslint/no-use-before-define */
import { Game } from 'ue';
import BP_StateComponent = Game.Blueprints.Component.BP_StateComponent.BP_StateComponent_C;

import { getBlueprintClass } from '../../Common/Class';
import { IActionInfo, IChangeActorState, TActorState } from '../Flow/Action';
import { Component, EBlueprintId, IActorStateComponent } from '../Interface';
import { ActionRunnerComponent } from './ActionRunnerComponent';
import StateComponent from './StateComponent';

const ACTOR_STATE_KEY = 'ActorState';
const DEFAULT_ACTOR_STATE: TActorState = 'Idle';

class ActorStateComponent extends Component implements IActorStateComponent {
    private ActorStateComponent: BP_StateComponent;

    private StateComponent: StateComponent;

    public get State(): TActorState {
        return this.StateComponent.GetState(ACTOR_STATE_KEY) || DEFAULT_ACTOR_STATE;
    }

    public set State(state: TActorState) {
        this.ActorStateComponent.Change(ACTOR_STATE_KEY, state);
        this.StateComponent.SetState(
            ACTOR_STATE_KEY,
            state !== DEFAULT_ACTOR_STATE ? state : undefined,
        );
    }

    public OnInit(): void {
        this.StateComponent = this.Entity.GetComponent(StateComponent);
        this.ActorStateComponent = this.Entity.Actor.GetComponentByClass(
            getBlueprintClass(EBlueprintId.ActorStateComponent),
        ) as BP_StateComponent;

        const actionRunner = this.Entity.GetComponent(ActionRunnerComponent);
        actionRunner.RegisterActionFun('ChangeActorState', this.ExecuteChangeActorState.bind(this));
    }

    public OnLoadState(): void {
        this.ActorStateComponent.Set(ACTOR_STATE_KEY, this.State);
    }

    private ExecuteChangeActorState(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as IChangeActorState;
        this.State = action.State;
    }
}

export default ActorStateComponent;
