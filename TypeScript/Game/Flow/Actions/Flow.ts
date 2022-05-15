/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/class-literal-property-style */
import { BehaviorFlowComponent } from '../../Component/BehaviorFlowComponent';
import { FlowComponent } from '../../Component/FlowComponent';
import { TalkComponent } from '../../Component/TalkComponent';
import {
    IChangeState,
    IJumpTalk,
    IChangeBehaviorState,
    ISetBehaviorPaused,
    IShowTalk,
} from '../Action';
import { Action } from '../ActionRunner';

export class ChangeStateAction extends Action<IChangeState> {
    public Execute(): void {
        const flowComponent = this.Entity.GetComponent(FlowComponent);
        flowComponent.ChangeState(this.Data.StateId);
    }
}

export class FinishStateAction extends Action<undefined> {
    public Execute(): void {
        const flowComponent = this.Entity.GetComponent(FlowComponent);
        flowComponent.FinishState();
    }
}

export class ShowTalkAction extends Action<IShowTalk> {
    public get IsSchedulable(): boolean {
        return true;
    }

    public get IsStoppable(): boolean {
        return false;
    }

    public async ExecuteSync(): Promise<void> {
        const flowComponent = this.Entity.GetComponent(FlowComponent);
        await flowComponent.ShowTalk(this.Data);
    }
}

export class JumpTalkAction extends Action<IJumpTalk> {
    public Execute(): void {
        const talkComponent = this.Entity.GetComponent(TalkComponent);
        talkComponent.JumpTalk(this.Data.TalkId);
    }
}

export class FinishTalkAction extends Action<undefined> {
    public Execute(): void {
        const talkComponent = this.Entity.GetComponent(TalkComponent);
        talkComponent.FinishTalk();
    }
}

export class ChangeBehaviorStateAction extends Action<IChangeBehaviorState> {
    public Execute(): void {
        const behaviorFlowComponent = this.Entity.GetComponent(BehaviorFlowComponent);
        behaviorFlowComponent.ChangeBehaviorState(this.Data.StateId);
        if (this.Data.IsInstant) {
            behaviorFlowComponent.StopCurrentState();
        }
    }
}

export class SetBehaviorPausedAction extends Action<ISetBehaviorPaused> {
    public Execute(): void {
        const behaviorFlowComponent = this.Entity.GetComponent(BehaviorFlowComponent);
        behaviorFlowComponent.IsPaused = this.Data.IsPaused;
    }
}
