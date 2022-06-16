/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
import { Actor, Rotator, Vector } from 'ue';

import { createSignal } from '../../Common/Misc/Async';
import { clampAnge } from '../../Common/Misc/Util';

type TEvaluate<T> = (from: T, to: T, time: number) => T;
type TCallBack<T> = (value: T) => void;
type TFinishType = 'canceled' | 'normal';
type TFinishCallback = (finishType: TFinishType) => void;

export interface ITweenParam<T> {
    Evaluate: TEvaluate<T>;
    From: T;
    To: T;
    Callback: TCallBack<T>;
    MaxTime: number;
    FinishCallback?: TFinishCallback;
}

export class TweenItem<T> implements ITweenParam<T> {
    public readonly Evaluate: TEvaluate<T>;

    public readonly From: T;

    public readonly To: T;

    public readonly Callback: TCallBack<T>;

    public readonly MaxTime: number;

    public FinishCallback: TFinishCallback;

    private Time: number;

    private IsEndByUser: boolean;

    public Value: T;

    public constructor(param: ITweenParam<T>) {
        Object.assign(this, param);
        this.Time = 0;
    }

    public Tick(deltaTime: number): void {
        if (this.IsEnd) {
            return;
        }

        this.Time += deltaTime;
        if (this.Time < this.MaxTime) {
            this.Value = this.Evaluate(this.From, this.To, this.Time / this.MaxTime);
        } else {
            this.Value = this.To;
        }
        this.Callback(this.Value);
        if (this.IsEnd) {
            if (this.FinishCallback) {
                this.FinishCallback('normal');
            }
        }
    }

    public Stop(): void {
        if (this.FinishCallback) {
            this.FinishCallback('canceled');
        }
        this.IsEndByUser = true;
    }

    public get IsEnd(): boolean {
        return this.IsEndByUser || this.Time >= this.MaxTime;
    }
}

export function evaluateVector(from: Vector, to: Vector, time: number): Vector {
    const x = from.X + (to.X - from.X) * time;
    const y = from.Y + (to.Y - from.Y) * time;
    const z = from.Z + (to.Z - from.Z) * time;
    return new Vector(x, y, z);
}

export function evaluateNumber(from: number, to: number, time: number): number {
    return from + (to - from) * time;
}

export class TweenManager {
    private readonly Items: Set<TweenItem<unknown>> = new Set();

    private readonly ItemsToRemove: TweenItem<unknown>[] = [];

    public Tick(deltaTime: number): void {
        this.Items.forEach((item) => {
            item.Tick(deltaTime);
            if (item.IsEnd) {
                this.ItemsToRemove.push(item);
            }
        });

        this.ItemsToRemove.splice(0).forEach((item) => {
            this.Items.delete(item);
        });
    }

    public AddTween<T>(tweenParam: ITweenParam<T>): TweenItem<T> {
        const item = new TweenItem(tweenParam);
        this.Items.add(item);
        return item;
    }

    public AddRotatoByZ(actor: Actor, angle: number, maxTime: number): TweenItem<number> {
        const from = clampAnge(actor.K2_GetActorRotation().Euler().Z);
        let to = clampAnge(angle);
        const delta = Math.abs(to - from);
        if (delta > 180) {
            to = to > from ? to - 360 : to + 360;
        }
        const time = (Math.abs(to - from) / 180) * maxTime;
        return this.AddTween<number>({
            From: from,
            To: to,
            MaxTime: time,
            Callback: (value) =>
                actor.K2_SetActorRotation(Rotator.MakeFromEuler(new Vector(0, 0, value)), false),
            Evaluate: evaluateNumber,
        });
    }

    public async RotatoToByZ(actor: Actor, angle: number, maxTime: number): Promise<void> {
        const tween = this.AddRotatoByZ(actor, angle, maxTime);
        const signal = createSignal();
        tween.FinishCallback = (): void => {
            signal.Emit(undefined);
        };
        await signal.Promise;
    }
}
