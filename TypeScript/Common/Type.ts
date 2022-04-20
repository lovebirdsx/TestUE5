/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
import { ComponentClass, FunctionComponent } from 'react';

import { error, log } from './Log';
import { getEnumValues } from './Util';

export type TElementRenderType =
    | 'array'
    | 'asset'
    | 'boolean'
    | 'custom'
    | 'dynamic'
    | 'entity'
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

export type TModifyType = 'fold' | 'normal';

export interface IAnyProps {
    Value: unknown;
    Owner?: unknown;
    Type: IAbstractType<unknown>;
    OnModify: (obj: unknown, type: TModifyType) => void;
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
    Check: (value: T, container: unknown, messages: string[]) => number;
    Meta: IMeta;
}

export abstract class DataScheme<TData = unknown, TMeta = unknown, TParent = unknown> {
    public abstract CreateDefault(parent: TParent): TData;

    public abstract Fix(value: TData, container: TParent): TFixResult;

    public abstract Check(value: TData, container: TParent, messages: string[]): number;

    public abstract Meta: TMeta;
}

export interface IDataProps<TData = unknown, TMeta = unknown, TParent = unknown> {
    Value: TData;
    Scheme: DataScheme<TData, TMeta, TParent>;
    Parent: TParent;
    ParentScheme?: DataScheme<TParent>;
    OnModify: (obj: TData) => void;
    PrefixElement?: string;
}

type TComponentClass<TProps> = ComponentClass<TProps> | FunctionComponent<TProps>;

export type TDataRender<TData = unknown, TMeta = unknown, TParent = unknown> = (
    props: IDataProps<TData, TMeta, TParent>,
) => TComponentClass<IDataProps<TData, TMeta, TParent>>;

class DataRegistry {
    private readonly ShemeMap = new Map<string, DataScheme>();

    private readonly RenderMap = new Map<string, TDataRender>();

    public Reg<TData, TMeta = unknown, TParent = unknown>(
        type: string,
        scheme: DataScheme<TData, TMeta, TParent>,
        render: TDataRender<TData, TMeta, TParent>,
    ): void {
        this.ShemeMap.set(type, scheme as DataScheme);
        this.RenderMap.set(type, render as TDataRender);
    }

    public Reg2<TData, TMeta = unknown, TParent = unknown>(
        type: TElementRenderType,
        scheme: DataScheme<TData, TMeta, TParent>,
        render: TDataRender<TData, TMeta, TParent>,
    ): void {
        this.Reg(type as string, scheme, render);
    }

    public GetScheme<TData, TMeta = unknown, TParent = unknown>(
        type: string,
    ): DataScheme<TData, TMeta, TParent> {
        const result = this.ShemeMap.get(type);
        if (!result) {
            throw new Error(`No sheme for type [${type}]`);
        }
        return result as DataScheme<TData, TMeta, TParent>;
    }

    public GetRender<TData, TMeta = unknown, TParent = unknown>(
        type: string,
    ): TDataRender<TData, TMeta, TParent> {
        const result = this.RenderMap.get(type);
        if (!result) {
            throw new Error(`No render for type [${type}]`);
        }
        return result as TDataRender<TData, TMeta, TParent>;
    }
}

export const dataRegistry = new DataRegistry();

export type TPrimitiveType<T extends bigint | boolean | number | string> = IAbstractType<T>;
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

export enum EObjectFilter {
    FlowList, // 在flowlist中执行
    Trigger, // 在trigger中执行
    Talk, // 在ShowTalk中执行
}

export const allObjectFilter = getEnumValues(EObjectFilter);
export function objectFilterExcept(...args: EObjectFilter[]): EObjectFilter[] {
    const result = allObjectFilter.filter((objerFilter) => !args.includes(objerFilter));
    return result;
}

export type TObjectFields<T> = { [K in keyof T]: IAbstractType<T[K]> };
export type TObjectType<T> = IAbstractType<T> & {
    Filters: EObjectFilter[];
    Fields: TObjectFields<T>;
    Scheduled?: boolean;
};

export type TClassFields<T> = Partial<TObjectFields<T>>;
export type TClassType<T> = IAbstractType<T> & {
    Fields: TClassFields<T>;
};

export type TDynamicObjectType<T> = IAbstractType<T> & {
    Filter: EObjectFilter;
};

export function createDynamicType<T>(
    filter: EObjectFilter,
    type: Omit<Partial<TDynamicObjectType<T>>, 'filter' | 'renderType'>,
): TDynamicObjectType<T> {
    if (!type.CreateDefault) {
        error(`Dynamic type CreateDefault can not be undefined`);
    }
    return {
        Filter: filter,
        RrenderType: 'dynamic',
        CreateDefault: type.CreateDefault,
        Fix: type.Fix || ((): TFixResult => 'nothing'),
        Check: type.Check || ((): number => 0),
        Meta: type.Meta || {},
        Render: type.Render,
    };
}

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
        Check: type.Check || ((): number => 0),
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
        Check:
            type.Check ||
            ((value, container, messages): number => {
                let fixCount = 0;
                value.forEach((e) => {
                    fixCount += type.Element.Check(e, value, messages);
                });
                return fixCount;
            }),
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

export function checkFields<T>(
    value: T,
    fields: TObjectFields<T>,
    errorMessages: string[],
): number {
    let errorCount = 0;
    for (const key in fields) {
        const filedTypeData = fields[key];
        if (value[key] === undefined) {
            if (!filedTypeData.Meta.Optional) {
                errorMessages.push(`字段[${key}]值为空`);
                errorCount++;
            }
        } else {
            errorCount += filedTypeData.Check(value[key], value, errorMessages);
        }
    }

    for (const key in value) {
        if (!fields[key] && !key.startsWith('_')) {
            errorMessages.push(`存在非法的字段[${key}]`);
            errorCount++;
        }
    }

    return errorCount;
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
        Filters: type.Filters || getEnumValues(EObjectFilter),
        Fix: type.Fix || ((value, container): TFixResult => fixFileds(value, fields)),
        Check:
            type.Check ||
            ((value, container, messages): number => checkFields(value, fields, messages)),
        Render: type.Render,
        Scheduled: type.Scheduled,
    };
}

export const emptyObjectScheme = createObjectScheme({});

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
        Check: type.Check || ((): number => 0),
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
        Check: type.Check || ((): number => 0),
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
        Check: type.Check || ((): number => 0),
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
        Check: type.Check || ((): number => 0),
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
        Check: type.Check || ((): number => 0),
    };
}

export const floatScheme = createFloatScheme();

// ============================================================================
export function createUnknownScheme(type: Partial<IAbstractType<unknown>>): IAbstractType<unknown> {
    return {
        RrenderType: 'custom',
        Render: type.Render,
        CreateDefault: type.CreateDefault || ((): unknown => undefined),
        Fix: type.Fix || ((): TFixResult => 'canNotFixed'),
        Check: type.Check || ((): number => 0),
        Meta: type.Meta || {},
    };
}
