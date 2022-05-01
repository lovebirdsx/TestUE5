/* eslint-disable spellcheck/spell-checker */
import { delay } from '../../Common/Async';
import { error, log, warn } from '../../Common/Log';
import { msgbox } from '../../Common/UeHelper';
import { ActionRunnerComponent } from '../Component/ActionRunnerComponent';
import { gameContext, IGlobalActionsRunner } from '../Interface';
import { IManager } from '../Manager/Interface';
import {
    IActionInfo,
    IInvoke,
    ILog,
    ISetFlowBoolOption,
    IShowMessage,
    IWait,
    TActionFun,
    TActionType,
} from './Action';

export class GlobalActionsRunner implements IManager, IGlobalActionsRunner {
    private readonly ActionMap: Map<TActionType, TActionFun>;

    public constructor() {
        this.ActionMap = new Map();
        this.ActionMap.set('Log', this.ExecuteLog.bind(this));
        this.ActionMap.set('Wait', this.ExecuteWait.bind(this));
        this.ActionMap.set('ShowMessage', this.ExecuteShowMessage.bind(this));
        this.ActionMap.set('SetFlowBoolOption', this.ExecuteSetFlowBoolOption.bind(this));
        this.ActionMap.set('Invoke', this.ExecuteInvoke.bind(this));

        gameContext.GlobalActionsRunner = this;
    }

    public Init(): void {
        //
    }

    public Exit(): void {
        //
    }

    public ContainsAction(actionType: TActionType): boolean {
        return this.ActionMap.has(actionType);
    }

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

    private ExecuteLog(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as ILog;
        switch (action.Level) {
            case 'Info':
                log(action.Content);
                break;
            case 'Warn':
                warn(action.Content);
                break;
            case 'Error':
                error(action.Content);
                break;
            default:
                break;
        }
    }

    private ExecuteShowMessage(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as IShowMessage;
        msgbox(action.Content);
    }

    private async ExecuteWait(actionInfo: IActionInfo): Promise<void> {
        const action = actionInfo.Params as IWait;
        return delay(action.Time);
    }

    private ExecuteSetFlowBoolOption(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as ISetFlowBoolOption;
        switch (action.Option) {
            case 'DisableInput':
                if (action.Value) {
                    gameContext.Player.DisableInput(gameContext.PlayerController);
                } else {
                    gameContext.Player.EnableInput(gameContext.PlayerController);
                }
                break;

            default:
                error(`Unsupported option type ${action.Option}`);
                break;
        }
    }

    private async ExecuteInvoke(actionInfo: IActionInfo): Promise<void> {
        const action = actionInfo.Params as IInvoke;
        const tsEntity = gameContext.EntityManager.GetEntity(action.Who);
        if (tsEntity === undefined) {
            error(
                `Can not invoke ${JSON.stringify(action.ActionInfo)} no exist entity guid:${
                    action.Who
                }`,
            );
            return;
        }

        const actionRunner = tsEntity.Entity.GetComponent(ActionRunnerComponent);
        await actionRunner.ExecuteOne(action.ActionInfo);
    }
}
