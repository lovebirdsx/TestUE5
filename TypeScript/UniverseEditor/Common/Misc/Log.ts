/* eslint-disable spellcheck/spell-checker */
import { MyLog } from 'ue';

function getTime(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// 调用MyLog前确保加入MyLog是否有效, 因为MyLog是编辑器中的模块, 在发布版本为空
export function log(msg: string): void {
    if (MyLog) {
        MyLog.Log(`${getTime()}: ${msg}`);
    }
}

export function warn(msg: string): void {
    if (MyLog) {
        MyLog.Warn(`${getTime()}: ${msg}`);
    }
}

export function error(msg: string): void {
    if (MyLog) {
        MyLog.Error(`${getTime()}: ${msg}`);
    }
}
