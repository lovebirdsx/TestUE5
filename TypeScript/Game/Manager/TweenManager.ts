/* eslint-disable spellcheck/spell-checker */
import { Actor, Rotator, Vector } from 'ue';

import { createSignal } from '../../Common/Async';
import { clampAnge } from '../../Common/Util';

type TEvaluate<T> = (from: T, to: T, time: number) => T;
type TCallBack<T> = (value: T) => void;

class TweenItem<T> {
    private readonly Evaluate: TEvaluate<T>;

    private readonly From: T;

    private readonly To: T;

    private readonly Callback: TCallBack<T>;

    private readonly MaxTime: number;

    private Time: number;

    private readonly FinishCallback: () => void;

    public Value: T;

    public constructor(
        from: T,
        to: T,
        maxTime: number,
        callback: TCallBack<T>,
        finishCallback: () => void,
        evaluate: TEvaluate<T>,
    ) {
        this.From = from;
        this.To = to;
        this.MaxTime = maxTime;
        this.Callback = callback;
        this.FinishCallback = finishCallback;
        this.Evaluate = evaluate;
        this.Time = 0;
    }

    public Tick(deltaTime: number): void {
        this.Time += deltaTime;
        if (this.Time < this.MaxTime) {
            this.Value = this.Evaluate(this.From, this.To, this.Time / this.MaxTime);
        } else {
            this.Value = this.To;
        }
        this.Callback(this.Value);
        if (this.IsEnd) {
            this.FinishCallback();
        }
    }

    public get IsEnd(): boolean {
        return this.Time >= this.MaxTime;
    }
}

function evaluateVector(from: Vector, to: Vector, time: number): Vector {
    const x = from.X + (to.X - from.X) * time;
    const y = from.Y + (to.Y - from.Y) * time;
    const z = from.Z + (to.Z - from.Z) * time;
    return new Vector(x, y, z);
}

function evaluateNumber(from: number, to: number, time: number): number {
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

    public AddVectorTween(
        from: Vector,
        to: Vector,
        time: number,
        callBack: (value: Vector) => void,
        finishCallback: () => void,
    ): void {
        const item = new TweenItem<Vector>(
            from,
            to,
            time,
            callBack,
            finishCallback,
            evaluateVector,
        );
        this.Items.add(item);
    }

    public AddNumberTween(
        from: number,
        to: number,
        time: number,
        callBack: (value: number) => void,
        finishCallback: () => void,
    ): void {
        const item = new TweenItem<number>(
            from,
            to,
            time,
            callBack,
            finishCallback,
            evaluateNumber,
        );
        this.Items.add(item);
    }

    public async RotatoToByZ(actor: Actor, rotator: Rotator, maxTime: number): Promise<void> {
        const signer = createSignal();
        const from = clampAnge(actor.K2_GetActorRotation().Euler().Z);
        let to = clampAnge(rotator.Euler().Z);
        const delta = Math.abs(to - from);
        if (delta > 180) {
            if (to > from) {
                to = to - 360;
            } else {
                to = to + 360;
            }
        }
        const time = (Math.abs(to - from) / 180) * maxTime;
        this.AddNumberTween(
            from,
            to,
            time,
            (value) =>
                actor.K2_SetActorRotation(Rotator.MakeFromEuler(new Vector(0, 0, value)), false),
            () => {
                signer.Emit(undefined);
            },
        );
        await signer.Promise;
    }
}
