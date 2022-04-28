/* eslint-disable no-void */
import { Actor, edit_on_instance } from 'ue';

import { log } from '../../Common/Log';
import { ActionRunnerComponent, ActionRunnerHandler } from '../Component/ActionRunnerComponent';
import StateComponent from '../Component/StateComponent';
import { parseTriggerActionsJson } from '../Flow/Action';
import { IGameContext, ITsTrigger, TComponentClass } from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import TsEntity from './TsEntity';

export const triggerComponentClasses: TComponentClass[] = [StateComponent, ActionRunnerComponent];

export class TsTrigger extends TsEntity implements ITsTrigger {
    // @cpp: int
    @edit_on_instance()
    public MaxTriggerTimes: number;

    @edit_on_instance()
    public TriggerActionsJson: string;

    // @no-blueprint
    private TriggerTimes = 0;

    // @no-blueprint
    private ActonRunner: ActionRunnerComponent;

    // @no-blueprint
    private Handler: ActionRunnerHandler;

    // @no-blueprint
    private State: StateComponent;

    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return triggerComponentClasses;
    }

    // @no-blueprint
    public Init(context: IGameContext): void {
        super.Init(context);
        this.ActonRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.State = this.Entity.GetComponent(StateComponent);
        this.Handler = this.ActonRunner.SpawnHandler(
            parseTriggerActionsJson(this.TriggerActionsJson).Actions,
        );
    }

    // @no-blueprint
    public Load(): void {
        super.Load();
        this.TriggerTimes = this.State.GetState<number>('TriggerTimes') || 0;
    }

    // @no-blueprint
    private DoTrigger(): void {
        this.TriggerTimes++;
        this.State.SetState('TriggerTimes', this.TriggerTimes);
        void this.Handler.Execute();
        log(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (!(other instanceof TsPlayer)) {
            return;
        }

        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }

        if (this.Handler.IsRunning) {
            return;
        }

        this.DoTrigger();
    }
}

export default TsTrigger;
