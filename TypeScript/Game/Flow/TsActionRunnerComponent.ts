/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { delay } from '../../Common/Async';
import { error, log, warn } from '../../Editor/Common/Log';
import TsEntityComponent from '../Entity/TsEntityComponent';
import {
    IActionInfo,
    ILog,
    IWait,
    parseTriggerActionsJson,
    TActionFun,
    TActionType,
} from './Action';

export class ActionRunnerHandler {
    private MyIsRunning: boolean;

    private readonly Actions: IActionInfo[];

    private readonly Runner: TsActionRunnerComponent;

    public constructor(actions: IActionInfo[], runner: TsActionRunnerComponent) {
        this.MyIsRunning = false;
        this.Actions = actions;
        this.Runner = runner;
    }

    public get IsRunning(): boolean {
        return this.MyIsRunning;
    }

    public Stop(): void {
        this.MyIsRunning = false;
    }

    public async Execute(): Promise<void> {
        if (this.IsRunning) {
            error(`${this.Runner.GetName()} can not run actions again`);
            return;
        }

        this.MyIsRunning = true;

        const actions = this.Actions;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            await this.Runner.ExecuteOne(action);
            if (!this.IsRunning) {
                break;
            }
        }

        this.MyIsRunning = false;
    }
}

class TsActionRunnerComponent extends TsEntityComponent {
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
    public SpawnHandlerByJson(json: string): ActionRunnerHandler {
        const triggerActions = parseTriggerActionsJson(json);
        return this.SpawnHandler(triggerActions.Actions);
    }

    // @no-blueprint
    public SpawnHandler(actions: IActionInfo[]): ActionRunnerHandler {
        return new ActionRunnerHandler(actions, this);
    }

    // @no-blueprint
    public async ExecuteOne(action: IActionInfo): Promise<void> {
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
