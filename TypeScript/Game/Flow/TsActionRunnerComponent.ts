/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ActorComponent, no_blueprint } from 'ue';

import { delay } from '../../Common/Async';
import { error, log, warn } from '../../Editor/Common/Log';
import { IActionInfo, ILog, IWait, parseTriggerActionsJson, TActionType } from './Action';

class TsActionRunnerComponent extends ActorComponent {
    @no_blueprint()
    public IsRunning: boolean;

    @no_blueprint()
    private ActionMap: Map<TActionType, (action: IActionInfo) => unknown>;

    public Constructor(): void {
        const owner = this.GetOwner();
        this.ActionMap = new Map();
        this.ActionMap.set('Wait', this.ExecuteWait.bind(this));
        this.ActionMap.set('Log', this.ExecuteLog.bind(this));
        log(
            `ActionRunner's name is ${this.GetName()} owner is ${owner ? owner.GetName() : 'null'}`,
        );
    }

    @no_blueprint()
    public ExecuteJson(json: string): void {
        const triggerActions = parseTriggerActionsJson(json);
        void this.Execute(triggerActions.Actions);
    }

    @no_blueprint()
    public async Execute(actions: IActionInfo[]): Promise<void> {
        if (this.IsRunning) {
            error(`${this.GetOwner().GetName()} can not run actions again`);
            return;
        }

        this.IsRunning = true;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            await this.ExecuteOne(action);
        }

        this.IsRunning = false;
    }

    @no_blueprint()
    private async ExecuteOne(action: IActionInfo): Promise<void> {
        const actionFun = this.ActionMap.get(action.Name);
        if (!actionFun) {
            error(`No action for action type [${action.Name}]`);
            return;
        }

        if (action.Async) {
            actionFun(action);
        } else {
            await actionFun(action);
        }
    }

    @no_blueprint()
    private ExecuteLog(action: IActionInfo): void {
        const logAction = action.Params as ILog;
        switch (logAction.Level) {
            case 'Info':
                log(logAction.Content);
                break;
            case 'Warn':
                warn(logAction.Content);
                break;
            case 'Error':
                error(logAction.Content);
                break;
            default:
                break;
        }
    }

    @no_blueprint()
    private async ExecuteWait(action: IActionInfo): Promise<void> {
        const waitAction = action.Params as IWait;
        return delay(waitAction.Time * 1000);
    }
}

export default TsActionRunnerComponent;
