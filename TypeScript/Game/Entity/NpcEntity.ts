/* eslint-disable spellcheck/spell-checker */
import { Entity } from '../../Common/Entity';
import { FlowComponent } from '../Component/FlowComponent';

export interface IInteractable {
    Interact: () => Promise<void>;
}

export class NpcEntity extends Entity implements IInteractable {
    private Flow: FlowComponent;

    public Init(): void {
        this.Flow = this.GetComponent(FlowComponent);
    }

    public async Interact(): Promise<void> {
        await this.Flow.Run();
    }
}
