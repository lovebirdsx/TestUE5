/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { ActionRunnerComponent } from '../Component/ActionRunnerComponent';
import { FlowComponent } from '../Component/FlowComponent';
import StateComponent from '../Component/StateComponent';
import { TalkComponent } from '../Component/TalkComponent';
import { IGameContext, TComponentClass } from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import TsEntity from './TsEntity';

export const npcComponentClasses: TComponentClass[] = [
    StateComponent,
    FlowComponent,
    TalkComponent,
    ActionRunnerComponent,
];

export class TsNpc extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return npcComponentClasses;
    }

    // @no-blueprint
    private Flow: FlowComponent;

    // @no-blueprint
    public Init(context: IGameContext): void {
        super.Init(context);
        this.Flow = this.Entity.GetComponent(FlowComponent);
    }

    // @no-blueprint
    public async Interact(player: TsPlayer): Promise<void> {
        await this.Flow.Run();
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
