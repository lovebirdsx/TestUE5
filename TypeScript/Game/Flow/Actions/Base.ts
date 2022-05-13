/* eslint-disable no-void */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/class-literal-property-style */
import { createSignal, ISignal, MS_PER_SEC } from '../../../Common/Async';
import { error, log, warn } from '../../../Common/Log';
import { msgbox } from '../../../Common/UeHelper';
import { Entity, gameContext } from '../../Interface';
import { IInvoke, ILog, IShowMessage, IWait } from '../Action';
import { Action, actionRegistry } from '../ActionRunner';

export class LogAction extends Action<ILog> {
    public Execute(): void {
        const data = this.Data;
        switch (data.Level) {
            case 'Info':
                log(data.Content);
                break;
            case 'Warn':
                warn(data.Content);
                break;
            case 'Error':
                error(data.Content);
                break;
            default:
                break;
        }
    }
}

export class ShowMessageAction extends Action<IShowMessage> {
    public Execute(): void {
        msgbox(this.Data.Content);
    }
}

export class WaitAction extends Action<IWait> {
    public get IsSchedulable(): boolean {
        return true;
    }

    private Signal: ISignal<void>;

    private TimeoutHandle: unknown;

    public async ExecuteSync(): Promise<void> {
        this.Signal = createSignal();

        this.TimeoutHandle = setTimeout(() => {
            this.Signal.Emit();
        }, this.Data.Time * MS_PER_SEC);

        await this.Signal.Promise;
        this.Signal = undefined;
    }

    public Stop(): void {
        if (this.Signal) {
            clearTimeout(this.TimeoutHandle as number);
            this.Signal.Emit();
        }
    }
}

export class InvokeAction extends Action<IInvoke> {
    private readonly Action: Action;

    public constructor(entity: Entity, info: IInvoke) {
        super(entity, info);

        const tsEntity = gameContext.EntityManager.GetEntity(info.Who);
        if (tsEntity === undefined) {
            throw new Error(
                `Can not invoke ${JSON.stringify(info.ActionInfo)} no exist entity guid: ${
                    info.Who
                }`,
            );
        }

        this.Action = actionRegistry.SpawnAction(
            info.ActionInfo.Name,
            tsEntity.Entity,
            info.ActionInfo.Params,
        );
        this.IsAsync = info.ActionInfo.Async;
    }

    public async ExecuteSync(): Promise<void> {
        await this.Action.ExecuteSync();
    }

    public Execute(): void {
        this.Action.Execute();
    }

    public get IsStoppable(): boolean {
        return this.Action.IsStoppable;
    }

    public get IsSchedulable(): boolean {
        return this.Action.IsSchedulable;
    }
}
