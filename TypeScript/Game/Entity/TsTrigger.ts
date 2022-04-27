/* eslint-disable no-void */
import { Actor, edit_on_instance } from 'ue';

import { TComponentClass } from '../../Common/Entity';
import { log } from '../../Common/Log';
import { ActionRunnerComponent, ActionRunnerHandler } from '../Component/ActionRunnerComponent';
import { parseTriggerActionsJson } from '../Flow/Action';
import TsPlayer from '../Player/TsPlayer';
import { ITsTrigger } from './Interface';
import TsEntity from './TsEntity';

export const triggerComponentClasses: TComponentClass[] = [ActionRunnerComponent];

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
    public GetComponentClasses(): TComponentClass[] {
        return triggerComponentClasses;
    }

    public ReceiveBeginPlay(): void {
        super.ReceiveBeginPlay();
        this.ActonRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.Handler = this.ActonRunner.SpawnHandler(
            parseTriggerActionsJson(this.TriggerActionsJson).Actions,
        );
        this.TriggerTimes = 0;
    }

    // @no-blueprint
    private DoTrigger(): void {
        this.TriggerTimes++;
        void this.Handler.Execute();
        log(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }

        if (this.Handler.IsRunning) {
            return;
        }

        if (!(other instanceof TsPlayer)) {
            return;
        }

        this.DoTrigger();
    }
}

export default TsTrigger;
