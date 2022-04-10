import { ActorComponent, no_blueprint } from 'ue';

import { error, log } from '../../Editor/Common/Log';
import { IActionInfo } from './Action';

class TsActionRunner extends ActorComponent {
    @no_blueprint()
    public IsRunning: boolean;

    public Constructor(): void {
        const owner = this.GetOwner();
        log(
            `ActionRunner's name is ${this.GetName()} owner is ${owner ? owner.GetName() : 'null'}`,
        );
    }

    @no_blueprint()
    public ExecuteJson(json: string): void {
        // todo
    }

    @no_blueprint()
    public Execute(actions: IActionInfo[]): void {
        if (this.IsRunning) {
            error(`${this.GetOwner().GetName()} can not run actions again`);
            return;
        }

        this.IsRunning = true;
        actions.forEach((action, id) => {
            this.ExecuteOne(action);
        });
        this.IsRunning = false;
    }

    @no_blueprint()
    private ExecuteOne(action: IActionInfo): void {
        if (action.Async) {
            this.ExecuteAsync(action);
        } else {
            this.ExecuteSync(action);
        }
    }

    @no_blueprint()
    private ExecuteAsync(action: IActionInfo): void {
        throw new Error('Method not implemented.');
    }

    @no_blueprint()
    private ExecuteSync(action: IActionInfo): void {
        throw new Error('Method not implemented.');
    }
}

export default TsActionRunner;
