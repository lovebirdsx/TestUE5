export const MS_PER_SEC = 1000;

/* eslint-disable spellcheck/spell-checker */
export async function delay(time: number): Promise<void> {
    return new Promise(function (resolve) {
        setTimeout(resolve, time * MS_PER_SEC);
    });
}

export interface ICancleableDelay {
    Promise: Promise<void>;
    IsFinished: () => boolean;
    Cancel: () => void;
}

export function createCancleableDelay(time: number): ICancleableDelay {
    let id: unknown = undefined;
    let finished = false;
    const promise = new Promise<void>((resolve): void => {
        id = setTimeout(() => {
            finished = true;
            resolve();
        }, time * MS_PER_SEC);
    });
    return {
        Promise: promise,
        IsFinished: () => finished,
        Cancel: (): void => {
            if (!finished) {
                clearTimeout(id as number);
            }
        },
    };
}

export interface ISignal<T> {
    Promise: Promise<T>;
    Emit: (t: T) => void;
    IsEmit: () => boolean;
    Result: () => T;
}

export type TCallback<T> = (t: T) => void;

export function createSignal<T>(): ISignal<T> {
    let resolve: TCallback<T> = undefined;
    let isEmit = false;
    let result: T = undefined;
    const promise = new Promise<T>((resolve0): void => {
        resolve = resolve0;
    });
    return {
        Promise: promise,
        Emit: (t: T): void => {
            isEmit = true;
            result = t;
            resolve(t);
        },
        IsEmit: () => isEmit,
        Result: () => result,
    };
}
