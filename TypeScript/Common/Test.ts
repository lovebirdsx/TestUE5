/* eslint-disable spellcheck/spell-checker */

import { error, log } from './Log';
import { deepEquals } from './Util';

export interface IErrorRecord {
    TestName: string;
    Error: Error;
}

const errorRecords: IErrorRecord[] = [];

export function getTestErrorRecords(): IErrorRecord[] {
    return errorRecords;
}

export function clearTestErrorRecords(): void {
    errorRecords.splice(0, errorRecords.length);
}

function addErrorRecord(name: string, error: Error): void {
    errorRecords.push({
        TestName: name,
        Error: error,
    });
}

export function test(name: string, fun: () => void): void {
    try {
        fun();
        log(`[${name}] passed`);
    } catch (e) {
        const e1 = e as Error;
        error(`[${name}] failed:\n ${e1.stack}`);
        addErrorRecord(name, e);
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

export function assertTrue(value: boolean, msg: string): void {
    if (!value) {
        throw new Error(`assert failed: \n${msg}\n: value is not true`);
    }
}

export function assertFlase(value: boolean, msg: string): void {
    if (value) {
        throw new Error(`assert failed: \n${msg}\n: value is not false`);
    }
}

export function assertGt<T>(a: T, b: T, msg: string): void {
    if (!(a > b)) {
        throw new Error(`assert failed: \n${msg}\n: ${JSON.stringify(a)} > ${JSON.stringify(b)}`);
    }
}

export function assertGe<T>(a: T, b: T, msg: string): void {
    if (!(a >= b)) {
        throw new Error(`assert failed: \n${msg}\n: ${JSON.stringify(a)} >= ${JSON.stringify(b)}`);
    }
}

export function assertError(msg: string, fun: () => void): void {
    let hasError = false;
    try {
        fun();
    } catch (error) {
        hasError = true;
    }

    if (!hasError) {
        throw new Error(`assert failed: \n${msg}`);
    }
}
