export const MS_PER_SEC = 1000;

/* eslint-disable spellcheck/spell-checker */
export async function delay(time: number): Promise<void> {
    return new Promise(function (resolve) {
        setTimeout(resolve, time * MS_PER_SEC);
    });
}

export async function delayByCondition(time: number, condtion: () => boolean): Promise<void> {
    return new Promise((resolve): void => {
        setTimeout(() => {
            if (condtion()) {
                resolve();
            }
        }, time * MS_PER_SEC);
    });
}

export type TCallback<T> = (t: T) => void;
export async function waitCallback<T>(
    setCallback: (resolve: TCallback<T>, reject: TCallback<T>) => void,
): Promise<T> {
    return new Promise<T>((resolve1, reject1) => {
        setCallback(resolve1, reject1);
    });
}
