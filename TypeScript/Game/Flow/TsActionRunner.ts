import { ActorComponent } from 'ue';

import { error } from '../../Editor/Common/Log';
import { IActionInfo } from './Action';

class TsActionRunner extends ActorComponent {
    //@no-blueprint
    private IsRunning: boolean;

    //@no-blueprint
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

    //@no-blueprint
    private ExecuteOne(action: IActionInfo): void {
        if (action.Async) {
            this.ExecuteAsync(action);
        } else {
            this.ExecuteSync(action);
        }
    }

    //@no-blueprint
    private ExecuteAsync(action: IActionInfo): void {
        throw new Error('Method not implemented.');
    }

    //@no-blueprint
    private ExecuteSync(action: IActionInfo): void {
        throw new Error('Method not implemented.');
    }
}

export default TsActionRunner;
