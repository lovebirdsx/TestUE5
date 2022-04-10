export async function delay(ms: number): Promise<unknown> {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
