import { Actor, edit_on_instance, no_blueprint } from 'ue';

import { error, log } from '../../Editor/Common/Log';
import TsActionRunner from '../Flow/TsActionRunner';
import TsPlayer from '../Player/TsPlayer';
import TsEntity from './TsEntity';

class TsTrigger extends TsEntity {
    // @cpp: int
    @edit_on_instance()
    public MaxTriggerTimes: number;

    @edit_on_instance()
    public TriggerActionsJson: string;

    @no_blueprint()
    private TriggerTimes = 0;

    @no_blueprint()
    private ActionRunner: TsActionRunner;

    public ReceiveBeginPlay(): void {
        super.ReceiveBeginPlay();

        this.TriggerTimes = 0;
        this.ActionRunner = this.GetComponentByTsClass(TsActionRunner);
        if (!this.ActionRunner) {
            error('TSTriggerEntity need set actionRunner');
        }
    }

    @no_blueprint()
    private DoTrigger(): void {
        this.TriggerTimes++;
        this.ActionRunner.ExecuteJson(this.TriggerActionsJson);
        log(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }

        if (this.ActionRunner.IsRunning) {
            return;
        }

        if (!(other instanceof TsPlayer)) {
            return;
        }

        this.DoTrigger();
    }
}

export default TsTrigger;
