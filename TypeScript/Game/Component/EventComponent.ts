/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, IInteractCall } from '../Interface';
import { IInteract } from '../Interface/Action';

export class EventComponent extends Component {
    private readonly Interactcall = new Set<IInteractCall>();

    public RegistryInteract(call: IInteractCall): void {
        if (this.Interactcall.has(call)) {
            throw new Error(`Add duplicate tick ${call.Name}`);
        }
        this.Interactcall.add(call);
    }

    public Activate(action: IInteract): void {
        this.Interactcall.forEach((call) => {
            call.CallBack(action);
        });
    }
}
