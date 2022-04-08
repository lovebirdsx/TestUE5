/* eslint-disable spellcheck/spell-checker */
import { MyLog } from 'ue';

export function log(msg: string): void {
    MyLog.Log(msg);
}

export function warn(msg: string): void {
    MyLog.Warn(msg);
}

export function error(msg: string): void {
    MyLog.Error(msg);
}
