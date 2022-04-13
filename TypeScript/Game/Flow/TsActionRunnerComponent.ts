/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ActorComponent } from 'ue';

import { delay } from '../../Common/Async';
import { error, log, warn } from '../../Editor/Common/Log';
import {
    IActionInfo,
    ILog,
    IWait,
    parseTriggerActionsJson,
    TActionFun,
    TActionType,
} from './Action';

class TsActionRunnerComponent extends ActorComponent {
    // @no-blueprint
    public IsRunning: boolean;

    // @no-blueprint
    private ActionMap: Map<TActionType, TActionFun>;

    public Constructor(): void {
        const owner = this.GetOwner();
        this.ActionMap = new Map();
        this.ActionMap.set('Wait', this.ExecuteWait.bind(this));
        this.ActionMap.set('Log', this.ExecuteLog.bind(this));
        log(
            `ActionRunner's name is ${this.GetName()} owner is ${owner ? owner.GetName() : 'null'}`,
        );
    }

    // @no-blueprint
    public RegisterActionFun(name: TActionType, fun: TActionFun): void {
        if (this.ActionMap.has(name)) {
            error(`RegisterActionFun [${name}] already registered`);
        }
        this.ActionMap.set(name, fun);
    }

    // @no-blueprint
    public ExecuteJson(json: string): void {
        const triggerActions = parseTriggerActionsJson(json);
        void this.Execute(triggerActions.Actions);
    }

    // @no-blueprint
    public async Execute(actions: IActionInfo[]): Promise<void> {
        if (this.IsRunning) {
            error(`${this.GetOwner().GetName()} can not run actions again`);
            return;
        }

        this.IsRunning = true;

        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            await this.ExecuteOne(action);
            if (!this.IsRunning) {
                break;
            }
        }

        this.IsRunning = false;
    }

    // @no-blueprint
    public Stop(): void {
        this.IsRunning = false;
    }

    // @no-blueprint
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

    // @no-blueprint
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

    // @no-blueprint
    private async ExecuteWait(action: IActionInfo): Promise<void> {
        const waitAction = action.Params as IWait;
        return delay(waitAction.Time * 1000);
    }
}

export default TsActionRunnerComponent;
