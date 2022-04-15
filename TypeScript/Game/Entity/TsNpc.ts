/* eslint-disable spellcheck/spell-checker */
import { Actor, edit_on_instance } from 'ue';

import { parseFlowInfo } from '../Flow/Action';
import TsFlowComponent from '../Flow/TsFlowComponent';
import TsPlayer from '../Player/TsPlayer';
import TsEntity from './TsEntity';

class TsNpc extends TsEntity {
    @edit_on_instance()
    public FlowJson: string;

    // @no-blueprint
    private Flow: TsFlowComponent;

    public ReceiveBeginPlay(): void {
        this.Flow = this.GetComponent(TsFlowComponent);
    }

    // @no-blueprint
    public async Interact(player: TsPlayer): Promise<void> {
        await this.Flow.Interact(parseFlowInfo(this.FlowJson));
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (!(other instanceof TsPlayer)) {
            return;
        }

        other.AddInteractor(this);
    }

    public ReceiveActorEndOverlap(other: Actor): void {
        if (!(other instanceof TsPlayer)) {
            return;
        }

        other.RemoveInteractor(this);
    }
}

export default TsNpc;
