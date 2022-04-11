/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
import { IActionInfo, ILog } from '../../../Game/Flow/Action';
import { error, log } from '../Log';

type TElementRenderType =
    | 'array'
    | 'asset'
    | 'boolean'
    | 'dynamic'
    | 'enum'
    | 'float'
    | 'int'
    | 'object'
    | 'string';

export interface IMeta {
    HideName?: boolean; // 是否显示字段的名字
    Hide?: boolean; // 是否在编辑器中隐藏
    NewLine?: boolean; // 字段是否换行
    Optional?: boolean; // 字段是否可选
    ArraySimplify?: boolean; // 数组的名字不新起一行
    Width?: number; // 显示的宽度
    Tip?: string; // 提示文字
}

export interface IAnyProps {
    Value: unknown;
    Type: IAbstractType<unknown>;
    OnModify: (obj: unknown) => void;
    PrefixElement?: JSX.Element;
    IsFolded?: boolean;
    OnFoldChange?: (folded: boolean) => void;
}

export type TRender = (props: IAnyProps) => JSX.Element;

export type TFixResult = 'canNotFixed' | 'fixed' | 'nothing';

export interface IAbstractType<T> {
    RrenderType: TElementRenderType;
    Render?: TRender;
    CreateDefault: (container: unknown) => T;
    Fix: (value: T, container: unknown) => TFixResult;
    Meta: IMeta;
}

export type TPrimitiveType<T extends boolean | number | string> = IAbstractType<T>;
export type TEnumType<T> = IAbstractType<T> & {
    Config: Record<string, string>;
    Names: string[];
};
export type TAssetType = IAbstractType<string> & {
    ClassPath: string;
    SearchPath: string;
};

export type TArrayType<T> = IAbstractType<T[]> & {
    Element: IAbstractType<T>;
};

export type TObjectFilter = 'normal' | 'talk';
export type TObjectFields<T> = { [K in keyof T]: IAbstractType<T[K]> };
export type TObjectType<T> = IAbstractType<T> & {
    Filters: TObjectFilter[];
    Fields: TObjectFields<T>;
    Scheduled?: boolean;
};

export type TClassFields<T> = Partial<TObjectFields<T>>;
type TClassType<T> = IAbstractType<T> & {
    Fields: TClassFields<T>;
};

export type TDynamicObjectType = IAbstractType<IActionInfo> & {
    Filter: TObjectFilter;
};

export function createDynamicType(
    filter: TObjectFilter,
    type: Omit<Partial<TDynamicObjectType>, 'filter' | 'renderType'>,
): TDynamicObjectType {
    return {
        Filter: filter,
        RrenderType: 'dynamic',
        CreateDefault:
            type.CreateDefault ||
            ((): IActionInfo => {
                const log: ILog = {
                    Level: 'Info',
                    Content: 'Hello World',
                };
                return {
                    Name: 'Log',
                    Params: log,
                };
            }),
        Fix: type.Fix || ((): TFixResult => 'nothing'),
        Meta: type.Meta || {},
        Render: type.Render,
    };
}

export const normalActionScheme = createDynamicType('normal', {
    Meta: {
        NewLine: true,
    },
});

function getEnumNames(config: Record<string, string>): string[] {
    const names = [] as string[];
    for (const key in config) {
        names.push(key);
    }
    return names;
}

export function createEnumType<T extends string>(
    config: Record<string, string>,
    type?: Omit<Partial<TEnumType<T>>, 'fix' | 'renderType'>,
): TEnumType<T> {
    // eslint-disable-next-line no-param-reassign
    type = type || {};
    return {
        RrenderType: 'enum',
        Config: config,
        CreateDefault:
            type.CreateDefault ||
            ((): T => {
                for (const k in config) {
                    return k as T;
                }
                return undefined;
            }),
        Meta: type.Meta || {},
        Fix: (value: string, container: unknown): TFixResult => {
            // 由于value是值类型,所以无法修复
            if (!config[value]) {
                return 'canNotFixed';
            }
            return 'nothing';
        },
        Names: getEnumNames(config),
    };
}

export function createArrayScheme<T>(
    type: Omit<Partial<TArrayType<T>>, 'renderType'>,
): TArrayType<T> {
    return {
        RrenderType: 'array',
        CreateDefault:
            type.CreateDefault ||
            function (): T[] {
                return [];
            },
        Element: type.Element,
        Meta: type.Meta || {},
        Fix:
            type.Fix ||
            ((value): TFixResult => {
                let fixCount = 0;
                value.forEach((e) => {
                    if (type.Element.Fix(e, value) === 'fixed') {
                        fixCount++;
                    }
                });
                return fixCount > 0 ? 'fixed' : 'nothing';
            }),
    };
}

export function fixFileds<T>(value: T, fields: TObjectFields<T>): TFixResult {
    let fixCount = 0;
    for (const key in fields) {
        const filedTypeData = fields[key];
        if (value[key] === undefined) {
            if (!filedTypeData.Meta.Optional) {
                value[key] = filedTypeData.CreateDefault(value);
                log(`fixed no exist field [${key}]`);
                fixCount++;
            }
        } else {
            const reuslt = filedTypeData.Fix(value[key], value);
            if (reuslt === 'fixed') {
                log(`fixed field [${key}] to ${JSON.stringify(value[key])}`);
                fixCount++;
            }
        }
    }

    const keysToRemove = [] as string[];
    for (const key in value) {
        if (!fields[key] && !key.startsWith('_')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (value as Record<string, unknown>)[key];
        fixCount++;
        log(`remove no exist field [${key}]`);
    });

    return fixCount > 0 ? 'fixed' : 'nothing';
}

export function createDefaultObject<T>(fields: TObjectFields<T>): T {
    const fieldArray = [];
    for (const key in fields) {
        const filedTypeData = fields[key];
        if (!filedTypeData.Meta.Optional) {
            fieldArray.push([key, filedTypeData.CreateDefault(undefined)]);
        }
    }
    return Object.fromEntries(fieldArray) as T;
}

export function createObjectScheme<T>(
    fields: { [K in keyof T]: IAbstractType<T[K]> },
    type?: Omit<Partial<TObjectType<T>>, 'fields' | 'renderType'>,
): TObjectType<T> {
    type = type || {};
    return {
        RrenderType: 'object',
        Fields: fields,
        Meta: type.Meta || {},
        CreateDefault: type.CreateDefault || ((): T => createDefaultObject(fields)),
        Filters: type.Filters || ['normal', 'talk'],
        Fix: type.Fix || ((value, container): TFixResult => fixFileds(value, fields)),
        Render: type.Render,
        Scheduled: type.Scheduled,
    };
}

export function createObjectSchemeForUeClass<T>(
    fields: TClassFields<T>,
    type?: Omit<Partial<TClassType<T>>, 'fields' | 'renderType'>,
): TObjectType<unknown> {
    type = type || {};
    return {
        RrenderType: 'object',
        Fields: fields,
        Meta: type.Meta || {},
        CreateDefault: type.CreateDefault || ((): T => null),
        Filters: [],
        Fix: type.Fix || ((value, container): TFixResult => 'canNotFixed'),
        Render: type.Render,
        Scheduled: false,
    };
}

// ============================================================================

export function createIntScheme(
    type?: Omit<Partial<TPrimitiveType<number>>, 'fix' | 'renderType'>,
): TPrimitiveType<number> {
    type = type || {};
    return {
        RrenderType: 'int',
        CreateDefault: type.CreateDefault || ((): number => 0),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
    };
}

export const intScheme = createIntScheme();

// ============================================================================

export function createStringScheme(
    type?: Omit<Partial<TPrimitiveType<string>>, 'fix' | 'renderType'>,
): TPrimitiveType<string> {
    type = type || {};
    return {
        RrenderType: 'string',
        CreateDefault: type.CreateDefault || ((): string => 'Empty'),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'nothing',
    };
}

export const stringScheme = createStringScheme();

// ============================================================================
export function createAssetScheme(
    type: Omit<Partial<TAssetType>, 'fix' | 'renderType'>,
): TAssetType {
    if (!type.ClassPath || !type.SearchPath) {
        error('AssetScheme must set ClassPath and SearchPath');
    }
    return {
        RrenderType: 'asset',
        CreateDefault: type.CreateDefault || ((): string => ''),
        Meta: type.Meta || {},
        Render: type.Render,
        ClassPath: type.ClassPath,
        SearchPath: type.SearchPath,
        Fix: () => 'nothing',
    };
}

// ============================================================================

export function createBooleanScheme(
    type?: Omit<Partial<TPrimitiveType<boolean>>, 'fix' | 'renderType'>,
): TPrimitiveType<boolean> {
    type = type || {};
    return {
        RrenderType: 'boolean',
        CreateDefault: type.CreateDefault || ((): false => false),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
    };
}

export const booleanScheme = createBooleanScheme();
export const booleanHideNameScheme = createBooleanScheme({
    Meta: { HideName: true },
});

// ============================================================================
export function createFloatScheme(
    type?: Omit<Partial<TPrimitiveType<number>>, 'fix' | 'renderType'>,
): TPrimitiveType<number> {
    type = type || {};
    return {
        RrenderType: 'float',
        CreateDefault: type.CreateDefault || ((): number => 0.0),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
    };
}

export const floatScheme = createFloatScheme();
