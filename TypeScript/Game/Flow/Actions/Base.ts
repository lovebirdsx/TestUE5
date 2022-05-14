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
    private MyAction: Action;

    private readonly Invoke: IInvoke;

    // 将MyAction的构造延迟, 可以避免一些不必要的问题
    private get Action(): Action {
        if (!this.MyAction) {
            const invoke = this.Invoke;
            const tsEntity = gameContext.EntityManager.GetEntity(invoke.Who);
            this.MyAction = actionRegistry.SpawnAction(
                invoke.ActionInfo.Name,
                tsEntity ? tsEntity.Entity : undefined,
                invoke.ActionInfo.Params,
            );
            this.IsAsync = invoke.ActionInfo.Async;
        }
        return this.MyAction;
    }

    public constructor(entity: Entity, invoke: IInvoke) {
        super(entity, invoke);

        this.Invoke = invoke;
    }

    public async ExecuteSync(): Promise<void> {
        const action = this.Action;
        if (!action.Entity) {
            // 如果此时Entity不存在, 则将action压入对应Actor的待执行Action序列中
            gameContext.StateManager.PushDelayAction(this.Invoke.Who, this.Invoke.ActionInfo);
        } else {
            await action.ExecuteSync();
        }
    }

    public Execute(): void {
        const action = this.Action;
        if (!action.Entity) {
            // 如果此时Entity不存在, 则将action压入对应Actor的待执行Action序列中
            gameContext.StateManager.PushDelayAction(this.Invoke.Who, this.Invoke.ActionInfo);
        } else {
            action.Execute();
        }
    }

    public get IsStoppable(): boolean {
        return this.Action.IsStoppable;
    }

    public get IsSchedulable(): boolean {
        return this.Action.IsSchedulable;
    }
}
