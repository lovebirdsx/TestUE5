/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { isChildOfClass } from '../../Common/Class';
import { toVector } from '../../Common/Interface';
import { IInteract } from '../Flow/Action';
import { Component, gameContext, IInteractCall, ITsEntity } from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import { IStateInfo, IUndergroundComponent } from '../Scheme/Component/UndergroundScheme';
import { EventComponent } from './EventComponent';
import { StateComponent } from './StateComponent';

export class UndergroundComponent extends Component implements IUndergroundComponent {
    public TestState: number;

    public StateInfo: IStateInfo[];

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
        if (isChildOfClass(other.Entity.Actor, TsPlayer)) {
            this.RestartPlayerPos();
        } else {
            if (other.Entity.Actor.ActorHasTag('DestroyUnderground')) {
                gameContext.EntityManager.RemoveEntity(other);
            }
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
        const info = this.StateMap.get(this.StateId);
        if (info) {
            const pos = toVector(info.RestartPos);
            const player = gameContext.Player;
            if (player) {
                player.K2_SetActorLocation(pos, false, null, false);
            }
        }
    }
}
