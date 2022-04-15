/* eslint-disable no-void */
import { Actor, edit_on_instance } from 'ue';

import { log } from '../../Editor/Common/Log';
import TsActionRunnerComponent, { ActionRunnerHandler } from '../Flow/TsActionRunnerComponent';
import TsPlayer from '../Player/TsPlayer';
import TsEntity from './TsEntity';

class TsTrigger extends TsEntity {
    // @cpp: int
    @edit_on_instance()
    public MaxTriggerTimes: number;

    @edit_on_instance()
    public TriggerActionsJson: string;

    // @no-blueprint
    private TriggerTimes = 0;

    // @no-blueprint
    private ActionRunner: TsActionRunnerComponent;

    // @no-blueprint
    private RunnerHandler: ActionRunnerHandler;

    public ReceiveBeginPlay(): void {
        this.TriggerTimes = 0;
        this.ActionRunner = this.GetComponent(TsActionRunnerComponent);
        this.RunnerHandler = this.ActionRunner.SpawnHandlerByJson(this.TriggerActionsJson);
    }

    // @no-blueprint
    private DoTrigger(): void {
        this.TriggerTimes++;
        void this.RunnerHandler.Execute();
        log(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }

        if (this.RunnerHandler.IsRunning) {
            return;
        }

        if (!(other instanceof TsPlayer)) {
            return;
        }

        this.DoTrigger();
    }
}

export default TsTrigger;
