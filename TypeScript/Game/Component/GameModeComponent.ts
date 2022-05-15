/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { toVector } from '../../Common/Interface';
import { isPlayer } from '../Entity/EntityRegistry';
import { IInteract } from '../Flow/Action';
import { Component, gameContext, IInteractCall, ITsEntity } from '../Interface';
import { IGameModeComponent, IStateInfo } from '../Scheme/Component/GameModeScheme';
import { EventComponent } from './EventComponent';
import { StateComponent } from './StateComponent';

export class GameModeComponent extends Component implements IGameModeComponent {
    public TestState: number;

    public StateInfo: IStateInfo[];

    private readonly StateMap = new Map<number, IStateInfo>();

    private State: StateComponent;

    private StateId = 1;

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);
        const event = this.Entity.GetComponent(EventComponent);
        const call: IInteractCall = {
            Name: 'GameModeComponent',
            CallBack: (action: IInteract) => {
                this.Activate(action);
            },
        };
        event.RegistryInteract(call);
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
        if (isPlayer(other.Entity.Actor)) {
            this.RestartPlayerPos();
        } else {
            gameContext.EntityManager.RemoveEntity(other);
        }
    }

    public OnStart(): void {
        this.RestartPlayerPos();
    }

    public OnLoadState(): void {
        this.StateId = this.TestState ? this.TestState : this.State.GetState<number>('StateId');
    }

    public RestartPlayerPos(): void {
        const info = this.StateMap.get(this.StateId);
        const pos = toVector(info.RestartPos);
        const player = gameContext.Player;
        if (player) {
            player.K2_SetActorLocation(pos, false, null, false);
        }
    }
}
