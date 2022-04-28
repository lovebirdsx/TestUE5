/* eslint-disable spellcheck/spell-checker */
import { FlowComponent } from '../Component/FlowComponent';
import { Entity } from '../Interface';

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
