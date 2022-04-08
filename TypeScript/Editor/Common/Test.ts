/* eslint-disable spellcheck/spell-checker */

import { error, log } from './Log';
import { deepEquals } from './Util';

export function test(name: string, fun: () => void): void {
    try {
        fun();
        log(`[${name}] passed`);
    } catch (e) {
        const e1 = e as Error;
        error(`[${name}] failed:\n ${e1.stack}`);
    }
}

export function assertEq<T>(exp: T, result: T, msg: string): void {
    if (!deepEquals(exp, result)) {
        throw new Error(
            `assert failed: \n${msg}\n: ${JSON.stringify(exp)} !== ${JSON.stringify(result)}`,
        );
    }
}

export function assertNe<T>(exp: T, result: T, msg: string): void {
    if (deepEquals(exp, result)) {
        throw new Error(
            `assert failed: \n${msg}\n: ${JSON.stringify(exp)} === ${JSON.stringify(result)}`,
        );
    }
}
