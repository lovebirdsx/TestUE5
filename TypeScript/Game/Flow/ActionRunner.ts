/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/class-literal-property-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable spellcheck/spell-checker */
import { error } from '../../Common/Log';
import { Entity } from '../Interface';
import { IActionInfo, TActionType } from './Action';

export class Action<T = unknown> {
    public readonly Entity: Entity;

    public readonly Data: T;

    public IsAsync = false;

    public get IsStoppable(): boolean {
        return true;
    }

    public get IsSchedulable(): boolean {
        return false;
    }

    public constructor(entity: Entity, data: T) {
        this.Entity = entity;
        this.Data = data;
    }

    public async ExecuteSync(): Promise<void> {
        throw new Error(`${this.constructor.name} ExecuteSync is not implemented`);
    }

    public Execute(): void {
        throw new Error(`${this.constructor.name} Execute is not implemented`);
    }

    public Stop(): void {
        throw new Error(`${this.constructor.name} stop is not implemented`);
    }
}

type TActionClass<TData> = new (entity: Entity, data: TData) => Action<TData>;

class ActionRegistry {
    private readonly ActionMap: Map<TActionType, TActionClass<unknown>> = new Map();

    public Register(type: TActionType, actionClass: TActionClass<unknown>): void {
        if (this.ActionMap.has(type)) {
            throw new Error(`Action ${type} already registered`);
        }
        this.ActionMap.set(type, actionClass);
    }

    public SpawnAction(type: TActionType, entity: Entity, data: unknown): Action {
        const classObj = this.ActionMap.get(type);
        if (!classObj) {
            throw new Error(`No action class for ${type}`);
        }

        return new classObj(entity, data);
    }
}

export const actionRegistry = new ActionRegistry();

export class ActionRunner {
    private readonly Name: string;

    public readonly Actions: Action[];

    public MyIsRunning = false;

    private MyIsInterrupt = false;

    private CurrAction: Action | undefined;

    public constructor(name: string, entity: Entity, infos: IActionInfo[]) {
        this.Name = name;
        this.Actions = infos.map((info) => {
            const action = actionRegistry.SpawnAction(info.Name, entity, info.Params);
            action.IsAsync = info.Async;
            return action;
        });
    }

    public async Execute(actionId?: number, actionFinishCb?: (id: number) => void): Promise<void> {
        if (this.MyIsRunning) {
            throw new Error(`${this.Name} can not run actions again`);
        }

        this.MyIsRunning = true;
        this.MyIsInterrupt = false;

        const actions = this.Actions;
        for (let i = actionId || 0; i < actions.length; i++) {
            const action = actions[i];
            this.CurrAction = action;
            if (!action.IsSchedulable) {
                action.Execute();
            } else {
                if (!action.IsAsync) {
                    await action.ExecuteSync();
                } else {
                    void action.ExecuteSync();
                }
            }

            if (this.MyIsInterrupt) {
                break;
            }

            if (actionFinishCb) {
                actionFinishCb(i);
            }
        }

        this.CurrAction = undefined;
        this.MyIsRunning = false;
    }

    public get IsInterrupt(): boolean {
        return this.MyIsInterrupt;
    }

    public get IsRunning(): boolean {
        return this.MyIsRunning;
    }

    public Stop(): void {
        if (!this.CurrAction) {
            return;
        }

        if (!this.CurrAction.IsSchedulable) {
            return;
        }

        if (this.CurrAction.IsAsync) {
            return;
        }

        if (this.CurrAction.IsStoppable) {
            this.MyIsInterrupt = true;
            this.CurrAction.Stop();
        } else {
            error(
                `Runner can not be stop because ${this.CurrAction.constructor.name} can not stopped`,
            );
        }
    }
}
