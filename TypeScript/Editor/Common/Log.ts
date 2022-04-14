/* eslint-disable spellcheck/spell-checker */
import { MyLog } from 'ue';

function getTime(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export function log(msg: string): void {
    MyLog.Log(`${getTime()}: ${msg}`);
}

export function warn(msg: string): void {
    MyLog.Warn(`${getTime()}: ${msg}`);
}

export function error(msg: string): void {
    MyLog.Error(`${getTime()}: ${msg}`);
}
