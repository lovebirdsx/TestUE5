export async function delay(ms: number): Promise<void> {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
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
