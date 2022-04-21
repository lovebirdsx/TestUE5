/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
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

export interface IProps<T = unknown, TScheme extends Scheme<T> = Scheme<T>> {
    Value: T;
    Owner?: unknown;
    Scheme: TScheme;
    OnModify: (obj: unknown, type: TModifyType) => void;
    PrefixElement?: JSX.Element;
    IsFolded?: boolean;
    OnFoldChange?: (folded: boolean) => void;
}

export type TRender = (props: IProps) => JSX.Element;

export type TFixResult = 'canNotFixed' | 'fixed' | 'nothing';

export abstract class Scheme<T = unknown> {
    public abstract RenderType: TElementRenderType;

    public Render?: TRender;

    public abstract CreateDefault(): T;

    public Fix(value: T): TFixResult {
        return 'canNotFixed';
    }

    public Check(value: T, messages: string[]): number {
        return 0;
    }

    public Meta: IMeta = {};

    public HideName?: boolean; // 是否显示字段的名字

    public Hide?: boolean; // 是否在编辑器中隐藏

    public NewLine?: boolean; // 字段是否换行

    public Optional?: boolean; // 字段是否可选

    public ArraySimplify?: boolean; // 数组的名字不新起一行

    public Width?: number; // 显示的宽度

    public Tip?: string; // 提示文字
}

export type TSchemeClass<T = undefined> = new () => Scheme<T>;

export function getSchemeClass<T = unknown>(scheme: Scheme<T>): TSchemeClass<T> {
    if (scheme.constructor) {
        return scheme.constructor as TSchemeClass<T>;
    }
    return undefined;
}

function getEnumNames(config: Record<string, string>): string[] {
    const names = [] as string[];
    for (const key in config) {
        names.push(key);
    }
    return names;
}

export class EnumScheme<T extends string> extends Scheme<T> {
    public RenderType: TElementRenderType = 'enum';

    public readonly Config: Record<string, string>;

    public readonly Names: string[];

    public readonly Meta: IMeta = {
        HideName: true,
    };

    public constructor(config: Record<string, string>) {
        super();
        this.Config = config;
        this.Names = getEnumNames(config);
    }

    public CreateDefault(): T {
        for (const k in this.Config) {
            return k as T;
        }
        return undefined;
    }
}

export class AssetScheme extends Scheme<string> {
    public RenderType: TElementRenderType = 'asset';

    public CreateDefault(): string {
        return '';
    }

    public ClassPath: string;

    public SearchPath: string;
}

export abstract class ArrayScheme<T = unknown> extends Scheme<T[]> {
    public RenderType: TElementRenderType = 'array';

    public CreateDefault(): T[] {
        return [];
    }

    public abstract Element: Scheme<T>;
}

export enum EActionFilter {
    FlowList, // 在flowlist中执行
    Trigger, // 在trigger中执行
    Talk, // 在ShowTalk中执行
}

export const allActionFilters = getEnumValues(EActionFilter);
export function actionFilterExcept(...args: EActionFilter[]): EActionFilter[] {
    const result = allActionFilters.filter((filter) => !args.includes(filter));
    return result;
}

export type TObjectFields<T> = { [K in keyof T]: Scheme<T[K]> };

export type TClassFields<T> = Partial<TObjectFields<T>>;
export type TClassType<T> = Scheme<T> & {
    Fields: TClassFields<T>;
};

export function createArrayScheme<T>(
    type: Omit<Partial<ArrayScheme<T>>, 'renderType'>,
): ArrayScheme<T> {
    return {
        RenderType: 'array',
        CreateDefault:
            type.CreateDefault ||
            function (): T[] {
                return [];
            },
        Element: type.Element,
        Meta: type.Meta || {},
        Check:
            type.Check ||
            ((value, messages): number => {
                let fixCount = 0;
                value.forEach((e) => {
                    fixCount += type.Element.Check(e, messages);
                });
                return fixCount;
            }),
        Fix:
            type.Fix ||
            ((value): TFixResult => {
                let fixCount = 0;
                value.forEach((e) => {
                    if (type.Element.Fix(e) === 'fixed') {
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
                value[key] = filedTypeData.CreateDefault();
                log(`fixed no exist field [${key}]`);
                fixCount++;
            }
        } else {
            const reuslt = filedTypeData.Fix(value[key]);
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
            errorCount += filedTypeData.Check(value[key], errorMessages);
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
            fieldArray.push([key, filedTypeData.CreateDefault()]);
        }
    }
    return Object.fromEntries(fieldArray) as T;
}

export abstract class ObjectScheme<T> extends Scheme<T> {
    public RenderType: TElementRenderType = 'object';

    public Filters: EActionFilter[] = allActionFilters;

    public abstract Fields: TObjectFields<T>;

    public CreateDefault(): T {
        return createDefaultObject<T>(this.Fields);
    }

    public Scheduled?: boolean;
}

export function createObjectScheme<T>(
    fields: { [K in keyof T]: Scheme<T[K]> },
    type?: Omit<Partial<ObjectScheme<T>>, 'fields' | 'renderType'>,
): ObjectScheme<T> {
    type = type || {};
    return {
        RenderType: 'object',
        Fields: fields,
        Meta: type.Meta || {},
        CreateDefault: type.CreateDefault || ((): T => createDefaultObject(fields)),
        Filters: type.Filters || getEnumValues(EActionFilter),
        Fix: type.Fix || ((value): TFixResult => fixFileds(value, fields)),
        Check: type.Check || ((value, messages): number => checkFields(value, fields, messages)),
        Render: type.Render,
        Scheduled: type.Scheduled,
    };
}

export const emptyObjectScheme = createObjectScheme({});

// ============================================================================

export class IntScheme extends Scheme<number> {
    public RenderType: TElementRenderType = 'int';

    public CreateDefault(): number {
        return 0;
    }
}

export function createIntScheme(
    type?: Omit<Partial<Scheme<number>>, 'fix' | 'renderType'>,
): Scheme<number> {
    type = type || {};
    return {
        RenderType: 'int',
        CreateDefault: type.CreateDefault || ((): number => 0),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
        Check: type.Check || ((): number => 0),
    };
}

export const intScheme = new IntScheme();

// ============================================================================

export class StringScheme extends Scheme<string> {
    public RenderType: TElementRenderType = 'string';

    public CreateDefault(): string {
        return '';
    }
}

export function createStringScheme(
    type?: Omit<Partial<Scheme<string>>, 'fix' | 'renderType'>,
): Scheme<string> {
    type = type || {};
    return {
        RenderType: 'string',
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
    type: Omit<Partial<AssetScheme>, 'fix' | 'renderType'>,
): AssetScheme {
    if (!type.ClassPath || !type.SearchPath) {
        error('AssetScheme must set ClassPath and SearchPath');
    }
    return {
        RenderType: 'asset',
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

export class BooleanScheme extends Scheme<boolean> {
    public RenderType: TElementRenderType = 'boolean';

    public CreateDefault(): boolean {
        return false;
    }
}

export function createBooleanScheme(
    type?: Omit<Partial<BooleanScheme>, 'fix' | 'renderType'>,
): BooleanScheme {
    type = type || {};
    return {
        RenderType: 'boolean',
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
    type?: Omit<Partial<Scheme<number>>, 'fix' | 'renderType'>,
): Scheme<number> {
    type = type || {};
    return {
        RenderType: 'float',
        CreateDefault: type.CreateDefault || ((): number => 0.0),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
        Check: type.Check || ((): number => 0),
    };
}

export class FloatScheme extends Scheme<number> {
    public RenderType: TElementRenderType = 'float';

    public CreateDefault(): number {
        return 0.0;
    }
}

export const floatScheme = new FloatScheme();

// ============================================================================
export function createUnknownScheme(type: Partial<Scheme>): Scheme {
    return {
        RenderType: 'custom',
        Render: type.Render,
        CreateDefault: type.CreateDefault || ((): unknown => undefined),
        Fix: type.Fix || ((): TFixResult => 'canNotFixed'),
        Check: type.Check || ((): number => 0),
        Meta: type.Meta || {},
    };
}
