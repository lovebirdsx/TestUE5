/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Class, KismetGuidLibrary } from 'ue';
import * as UE from 'ue';

import { error } from './Log';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type RequiredField<T, K extends keyof T> = Required<Pick<T, K>> & T;

/* eslint-disable spellcheck/spell-checker */
export function getEnumValues(enumType: Record<number, string>): number[] {
    const valueNames = Object.keys(enumType).filter((item) => !Number.isNaN(Number(item)));
    return valueNames.map((name) => Number(name));
}

export function getEnumNames(enumType: Record<number, string>): string[] {
    const names = Object.keys(enumType).filter((item) => Number.isNaN(Number(item)));
    return names;
}

export function deepEquals<T>(x: T, y: T, ignoreUnderScore?: boolean): boolean {
    if (x === y) {
        return true;
    }

    const typeX = typeof x;
    const typeY = typeof y;

    if (typeX !== typeY) {
        return false;
    }

    if (typeX !== 'object' || x === undefined || y === undefined) {
        return false;
    }

    if (x instanceof Array) {
        if (x.length !== (y as unknown as unknown[]).length) {
            return false;
        }

        for (let i = 0; i < x.length; i++) {
            if (!deepEquals(x[i], y[i])) {
                return false;
            }
        }
    } else {
        for (const key in x) {
            if (ignoreUnderScore && key.startsWith('_')) {
                continue;
            }

            if (!deepEquals(x[key], y[key])) {
                return false;
            }
        }

        for (const key in y) {
            if (ignoreUnderScore && key.startsWith('_')) {
                continue;
            }

            if (x[key] === undefined && y[key] !== undefined) {
                return false;
            }
        }
    }

    return true;
}

export function subArray<T>(a: T[], b: T[]): T[] {
    if (b.length <= 0) {
        return a;
    }
    return a.filter((v) => !b.includes(v));
}

export function addArray<T>(a: T[], b: T[]): T[] {
    if (a.length <= 0) {
        return b;
    }
    if (b.length <= 0) {
        return a;
    }
    return [...a, ...b];
}

export function calHash(str: string): number {
    let hash = 0;
    const length = str.length;
    if (length === 0) {
        return hash;
    }

    for (let i = 0; i < length; i++) {
        const chr = str.charCodeAt(i);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }

    if (hash < 0) {
        hash = -hash;
    }

    return hash;
}

export function getFieldCount<T>(obj: T): number {
    let count = 0;
    for (const key in obj) {
        if (key) {
            count++;
        }
    }
    return count;
}

export function loadClass(classNameOrPath: string): Class {
    if (classNameOrPath.includes('/')) {
        return Class.Load(classNameOrPath);
    }

    const tsClassObj = (UE as Record<string, unknown>)[classNameOrPath] as {
        StaticClass: () => Class;
    };
    return tsClassObj.StaticClass();
}

// 将value转换为json格式, filterUnderScore表示是否过滤掉以下划线开头的字段
// 如果filterUnderScore为真, 则
// 对于: { name: 'hello', _folded: true }
// 将被格式化成: { name: 'hello' }
export function stringify(value: unknown, filterUnderScore?: boolean): string {
    return JSON.stringify(
        value,
        (key: string, value: unknown): unknown => {
            if (filterUnderScore && typeof key === 'string' && key.startsWith('_')) {
                return undefined;
            }
            return value;
        },
        2,
    );
}

// 解析json格式, filterUnderScore表示是否过滤掉以下滑线开头的字段
export function parse(text: string, filterUnderScore?: boolean): unknown {
    return JSON.parse(text, (key: string, value: unknown): unknown => {
        if (filterUnderScore && key.startsWith('_')) {
            return undefined;
        }
        return value;
    });
}

// 将value中包含的编辑器配置(字段名以下划线_开始)导出
// 譬如 { name: 'hello', _folded: true }
// 将被导出为 { _folded: true }
export function stringifyEditor(value: unknown): string {
    return JSON.stringify(
        value,
        (key: unknown, value: unknown): unknown => {
            if (
                typeof key === 'string' &&
                key.length > 0 &&
                !key.startsWith('_') &&
                typeof value !== 'object'
            ) {
                return undefined;
            }
            return value;
        },
        2,
    );
}

export function alignNumber(value: number, len = 1): number {
    return Math.floor(value / len) * len;
}

export function calUpRotatorByPoints(from: UE.Vector, to: UE.Vector): UE.Rotator {
    const dir = to.op_Subtraction(from);
    dir.Z = 0;
    return dir.Rotation();
}

export function clampAnge(angle: number): number {
    let newAgnel = angle % 360;
    if (newAgnel < 0) {
        newAgnel += 360;
    }
    return newAgnel;
}

export type TCallBack<T1, T2, T3> = (arg1?: T1, arg2?: T2, arg3?: T3) => void;

export class Event<T1 = unknown, T2 = unknown, T3 = unknown> {
    private readonly Callbacks: TCallBack<T1, T2, T3>[] = [];

    private readonly Name: string;

    public constructor(name: string) {
        this.Name = name;
    }

    public AddCallback(cb: TCallBack<T1, T2, T3>): void {
        this.Callbacks.push(cb);
    }

    public RemoveCallBack(cb: TCallBack<T1, T2, T3>): void {
        const index = this.Callbacks.indexOf(cb);
        if (index >= 0) {
            this.Callbacks.splice(index, 1);
        } else {
            error(`Remove no exist callback for Event ${this.Name}`);
        }
    }

    public Invoke(arg1?: T1, arg2?: T2, arg3?: T3): void {
        this.Callbacks.forEach((cb) => {
            cb(arg1, arg2, arg3);
        });
    }
}

export function readJsonObj<T>(path: string, defalut?: T): T | undefined {
    const content = UE.MyFileHelper.Read(path);
    if (content) {
        return JSON.parse(content) as T;
    }
    return defalut ? defalut : undefined;
}

export function writeJson(obj: unknown, path: string, filterUnderScore?: boolean): void {
    UE.MyFileHelper.Write(path, stringify(obj, filterUnderScore));
}

export function isEditor(): boolean {
    return UE.EditorOperations !== undefined;
}

export function getGuid(actor: UE.Actor): string {
    return actor.ActorGuid.ToString();
}

export function genGuid(): string {
    return KismetGuidLibrary.NewGuid().ToString();
}

export function getTotalSecond(): number {
    const now = UE.KismetMathLibrary.UtcNow();
    const day = UE.KismetMathLibrary.GetDayOfYear(now);
    const hour = UE.KismetMathLibrary.GetHour(now);
    const minute = UE.KismetMathLibrary.GetMinute(now);
    const second = UE.KismetMathLibrary.GetSecond(now);
    const totalSecond = second + minute * 60 + hour * 3600 + day * 86400;
    return totalSecond;
}

export function isChildOfClass(childClass: UE.Class, parentClass: UE.Class): boolean {
    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}

export function isObjChildOfClass(childObj: UE.Object, parentClass: UE.Class): boolean {
    const childClass = childObj.GetClass();
    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}

export function getAssetPath(classObj: UE.Class): string {
    const pkg = UE.EditorOperations.GetPackage(classObj);
    return pkg.GetName();
}

export function isValidActor(actor: UE.Actor): boolean {
    let hasError = false;
    try {
        actor.GetTransform();
    } catch (e) {
        hasError = true;
    }

    return !hasError;
}

export function toTsArray<T>(array: UE.TArray<T>): T[] {
    const result = [] as T[];
    for (let i = 0; i < array.Num(); i++) {
        result.push(array.Get(i));
    }
    return result;
}

export function toUeArray<TR extends UE.SupportedContainerKVType, T extends UE.ContainerKVType<TR>>(
    array: T[],
    rt: TR,
): UE.TArray<UE.ContainerKVType<TR>> {
    const result = UE.NewArray(rt);
    array.forEach((e) => {
        result.Add(e);
    });
    return result;
}

export function createDiff(origin: unknown, base: unknown, ignoreUnderScore?: boolean): unknown {
    if (base === undefined || origin === undefined) {
        return origin;
    }

    if (typeof origin !== 'object' || typeof base !== 'object') {
        return origin;
    }

    let differentFileds = 0;
    const result = {};

    // 仅from有的字段
    for (const key in origin) {
        if (ignoreUnderScore && key.startsWith('_')) {
            continue;
        }
        if (base[key] === undefined) {
            result[key] = origin[key] as unknown;
            differentFileds++;
        }
    }

    for (const key in base) {
        if (ignoreUnderScore && key.startsWith('_')) {
            continue;
        }
        const vFrom = origin[key] as unknown;
        const vTo = base[key] as unknown;

        // 双方都有的字段
        if (vFrom !== undefined) {
            const typeFrom = typeof vFrom;
            const typeTo = typeof vTo;
            if (typeFrom === typeTo && typeFrom === 'object') {
                const data = createDiff(vFrom, vTo, ignoreUnderScore);
                result[key] = data;
                if (data !== undefined) {
                    differentFileds++;
                }
            } else {
                if (vFrom !== vTo) {
                    result[key] = vFrom;
                    differentFileds++;
                }
            }
        }
    }

    if (differentFileds === 0) {
        return undefined;
    }

    if (base instanceof Array) {
        return Object.values(result);
    }

    return result;
}

export function applyDiff(data: unknown, base: unknown, ignoreUnderScore?: boolean): unknown {
    if (data === undefined) {
        return base;
    }

    if (base === undefined) {
        return data;
    }

    if (typeof data !== 'object') {
        return data;
    }

    if (typeof base !== 'object') {
        return data;
    }

    const result = {};

    // 仅data中存在的字段
    for (const key in data) {
        if (ignoreUnderScore && key.startsWith('_')) {
            continue;
        }

        if (base[key] === undefined) {
            result[key] = data[key] as unknown;
        }
    }

    for (const key in base) {
        if (ignoreUnderScore && key.startsWith('_')) {
            continue;
        }

        const vData = data[key] as unknown;
        const vBase = base[key] as unknown;
        if (vData === undefined) {
            // 仅base中存在的字段
            result[key] = vBase;
        } else {
            const typeData = typeof vData;
            const typeBase = typeof vBase;
            if (typeData !== typeBase) {
                result[key] = vData;
            } else {
                if (typeData === 'object') {
                    result[key] = applyDiff(vData, vBase, ignoreUnderScore);
                } else {
                    result[key] = vData;
                }
            }
        }
    }

    if (base instanceof Array) {
        return Object.values(result);
    }

    return result;
}
