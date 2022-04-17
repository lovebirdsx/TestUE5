/* eslint-disable spellcheck/spell-checker */
import { delay } from '../../Common/Async';
import { error, log, warn } from '../../Common/Log';
import TsPlayer from '../Player/TsPlayer';
import TsPlayerController from '../Player/TsPlayerController';
import { IActionInfo, ILog, ISetFlowBoolOption, IWait, TActionFun, TActionType } from './Action';

class GlobalActionsRunner {
    private readonly ActionMap: Map<TActionType, TActionFun>;

    public constructor() {
        this.ActionMap = new Map();
        this.ActionMap.set('Log', this.ExecuteLog.bind(this));
        this.ActionMap.set('Wait', this.ExecuteWait.bind(this));
        this.ActionMap.set('SetFlowBoolOption', this.ExecuteSetFlowBoolOption.bind(this));
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

    private async ExecuteWait(actionInfo: IActionInfo): Promise<void> {
        const action = actionInfo.Params as IWait;
        return delay(action.Time);
    }

    private ExecuteSetFlowBoolOption(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as ISetFlowBoolOption;
        switch (action.Option) {
            case 'DisableInput':
                {
                    const playerController = TsPlayerController.Instance;
                    if (action.Value) {
                        TsPlayer.Instance.DisableInput(playerController);
                    } else {
                        TsPlayer.Instance.EnableInput(playerController);
                    }
                }
                break;

            default:
                error(`Unsupported option type ${action.Option}`);
                break;
        }
    }
}

export const globalActionsRunner = new GlobalActionsRunner();
