import { error } from '../../Common/Log';
import { IActionInfo, TActionFun, TActionType } from '../Flow/Action';
import { Component, gameContext } from '../Interface';

export class ActionRunnerHandler {
    private MyIsRunning: boolean;

    private readonly Actions: IActionInfo[];

    private readonly Runner: ActionRunnerComponent;

    public constructor(actions: IActionInfo[], runner: ActionRunnerComponent) {
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
            error(`${this.Runner.Name} can not run actions again`);
            return;
        }

        this.MyIsRunning = true;

        const actions = this.Actions;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            // eslint-disable-next-line no-await-in-loop
            await this.Runner.ExecuteOne(action);
            if (!this.IsRunning) {
                break;
            }
        }

        this.MyIsRunning = false;
    }
}

export class ActionRunnerComponent extends Component {
    private readonly ActionMap = new Map<TActionType, TActionFun>();

    public RegisterActionFun(name: TActionType, fun: TActionFun): void {
        if (this.ActionMap.has(name)) {
            error(`RegisterActionFun [${name}] already registered`);
        }
        this.ActionMap.set(name, fun);
    }

    public SpawnHandler(actions: IActionInfo[]): ActionRunnerHandler {
        return new ActionRunnerHandler(actions, this);
    }

    public async ExecuteOne(action: IActionInfo): Promise<void> {
        const globalActionsRunner = gameContext.GlobalActionsRunner;
        if (globalActionsRunner.ContainsAction(action.Name)) {
            await globalActionsRunner.ExecuteOne(action);
            return;
        }

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
}
