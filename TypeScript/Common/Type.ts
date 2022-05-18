/* eslint-disable spellcheck/spell-checker */
import { TColor } from './Color';
import { error, warn } from './Log';
import { getEnumValues } from './Util';

export type TElementRenderType =
    | 'array'
    | 'asset'
    | 'boolean'
    | 'csvIndexValue'
    | 'custom'
    | 'dynamic'
    | 'entityId'
    | 'entityTemplateId'
    | 'enum'
    | 'float'
    | 'int'
    | 'object'
    | 'string'
    | 'vector';

export type TModifyType = 'fold' | 'normal';

export interface IProps<T = unknown, TScheme extends Scheme<T> = Scheme<T>> {
    Value: T;
    Owner?: unknown;
    Scheme: TScheme;
    OnModify: (obj: T, type: TModifyType) => void;
    PrefixElement?: JSX.Element;
    IsFolded?: boolean;
    OnFoldChange?: (folded: boolean) => void;
}

export type TRender = (props: IProps) => JSX.Element;

export type TFixResult = 'canNotFixed' | 'fixed' | 'nothing';

export class Scheme<T = unknown> {
    public Name = 'Scheme';

    public CnName = '空';

    public RenderType: TElementRenderType = 'string';

    public CreateDefault(): T {
        return undefined;
    }

    public Fix(value: T): TFixResult {
        return 'canNotFixed';
    }

    public Check(value: T, messages: string[]): number {
        return 0;
    }

    public ShowName?: boolean; // 是否显示字段的名字

    public Hide?: boolean; // 是否在编辑器中隐藏

    public NewLine?: boolean; // 字段是否换行

    public Optional?: boolean; // 字段是否可选

    public ArraySimplify?: boolean; // 数组的名字不新起一行

    public Width?: number; // 显示的宽度

    public MaxWidth?: number; // 显示的最大宽度

    public Tip?: string; // 提示文字

    // 是否唯一, 若用该scheme对应的数据构造数组, 则需要避免相同值
    public IsUnique?: boolean;
}

export function createScheme<T>(type: Partial<Scheme<T>>): Scheme<T> {
    const scheme = new Scheme<T>();
    Object.assign(scheme, type);
    return scheme;
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

function getEnumCnNames(config: Record<string, string>): string[] {
    const cnNames = [] as string[];
    for (const key in config) {
        cnNames.push(config[key]);
    }
    return cnNames;
}

export class EnumScheme<T extends string> extends Scheme<T> {
    public Name = 'EnumScheme';

    public RenderType: TElementRenderType = 'enum';

    public Config: Record<string, string>;

    private MyNames: string[];

    private MyCnNames: string[];

    public get Names(): string[] {
        if (!this.MyNames) {
            this.MyNames = getEnumNames(this.Config);
        }
        return this.MyNames;
    }

    public get CnNames(): string[] {
        if (!this.MyCnNames) {
            this.MyCnNames = getEnumCnNames(this.Config);
        }
        return this.MyCnNames;
    }

    public GetNameByCnName(cnName: string): string {
        const index = this.CnNames.indexOf(cnName);
        return this.Names[index];
    }

    public GetCnNameByName(name: string): string {
        const index = this.Names.indexOf(name);
        return this.CnNames[index];
    }

    public CreateDefault(): T {
        for (const k in this.Config) {
            return k as T;
        }
        return undefined;
    }
}

export function createEnumScheme<T extends string>(
    type: Omit<Partial<EnumScheme<T>>, 'RenderType'>,
): EnumScheme<T> {
    const scheme = new EnumScheme<T>();
    Object.assign(scheme, type);
    return scheme;
}

export enum EActionFilter {
    FlowList, // 在flowlist中执行
    Trigger, // 在trigger中执行
    Talk, // 在ShowTalk中执行
    Invoke, // 在Invoke中执行
    Trample,
    BehaviorFlow,
    Function,
}

export const allActionFilters = getEnumValues(EActionFilter);
export function actionFilterExcept(...args: EActionFilter[]): EActionFilter[] {
    const result = allActionFilters.filter((filter) => !args.includes(filter));
    return result;
}
export const actionFilterExcpetInvoke = actionFilterExcept(EActionFilter.Invoke);

export type TObjectFields<T> = { [K in keyof T]: Scheme<T[K]> };

export type TClassFields<T> = Partial<TObjectFields<T>>;
export type TClassType<T> = Scheme<T> & {
    Fields: TClassFields<T>;
};

export class ArrayScheme<T = unknown> extends Scheme<T[]> {
    public RenderType: TElementRenderType = 'array';

    public CreateDefault(): T[] {
        return [];
    }

    public Element: Scheme<T>;

    public Check(value: T[], messages: string[]): number {
        let fixCount = 0;
        value.forEach((e) => {
            fixCount += this.Element.Check(e, messages);
        });
        return fixCount;
    }

    public Fix(value: T[]): TFixResult {
        let fixCount = 0;
        value.forEach((e) => {
            if (this.Element.Fix(e) === 'fixed') {
                fixCount++;
            }
        });
        return fixCount > 0 ? 'fixed' : 'nothing';
    }
}

export type TIndexType = bigint | number | string;

export function isIndexType(value: unknown): boolean {
    const t = typeof value;
    return t === 'number' || t === 'string' || t === 'bigint';
}

export function getObjArraySameFieldCount(
    filedKey: string,
    filedValue: TIndexType,
    array: Record<string, unknown>[],
): number {
    let count = 0;
    array.forEach((value) => {
        if (value[filedKey] === filedValue) {
            count++;
        }
    });
    return count;
}

export function getObjArrayRenderColorForField(
    fieldName: string,
    filedValue: unknown,
    array: Record<string, unknown>[],
    fieldScheme: Scheme,
    childScheme: ObjectScheme<unknown>,
    arrayScheme: ArrayScheme,
): TColor {
    if (!arrayScheme) {
        return undefined;
    }

    if (childScheme !== arrayScheme.Element) {
        return undefined;
    }

    if (!fieldScheme.IsUnique) {
        return undefined;
    }

    if (!isIndexType(filedValue)) {
        return undefined;
    }

    const sameFiledCount = getObjArraySameFieldCount(fieldName, filedValue as TIndexType, array);
    return sameFiledCount <= 1 ? undefined : '#8B0000 dark red';
}

export function createArrayScheme<T>(
    type: Omit<Partial<ArrayScheme<T>>, 'renderType'>,
): ArrayScheme<T> {
    const scheme = new ArrayScheme<T>();
    Object.assign(scheme, type);
    return scheme;
}

// ============================================================================

export class IntScheme extends Scheme<number> {
    public RenderType: TElementRenderType = 'int';

    public CreateDefault(): number {
        return 0;
    }
}

export function createIntScheme(type?: Omit<Partial<IntScheme>, 'fix' | 'renderType'>): IntScheme {
    const scheme = new IntScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}

export const intScheme = new IntScheme();

// ============================================================================

export class StringScheme extends Scheme<string> {
    public RenderType: TElementRenderType = 'string';

    public IsJson?: boolean;

    public CreateDefault(): string {
        return 'Empty';
    }
}

export function createStringScheme(
    type: Omit<Partial<StringScheme>, 'fix' | 'renderType'>,
): StringScheme {
    const scheme = new StringScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}

export const stringScheme = createStringScheme({
    Name: 'String',
});

// ============================================================================
export class AssetScheme extends Scheme<string> {
    public RenderType: TElementRenderType = 'asset';

    public CreateDefault(): string {
        return '';
    }

    public ClassPath: string;

    public SearchPath: string;
}

export function createAssetScheme(
    type: Omit<Partial<AssetScheme>, 'fix' | 'renderType'>,
): AssetScheme {
    if (!type.ClassPath || !type.SearchPath) {
        error('AssetScheme must set ClassPath and SearchPath');
    }
    const scheme = new AssetScheme();
    Object.assign(scheme, type);
    return scheme;
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
    const scheme = new BooleanScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}

export const booleanHideNameScheme = createBooleanScheme({
    Name: 'Boolean',
});
export const booleanScheme = createBooleanScheme({
    Name: 'Boolean',
    ShowName: true,
});

// ============================================================================
export class FloatScheme extends Scheme<number> {
    public RenderType: TElementRenderType = 'float';

    public CreateDefault(): number {
        return 0.0;
    }
}

export function createFloatScheme(
    type: Omit<Partial<FloatScheme>, 'fix' | 'renderType'>,
): FloatScheme {
    const scheme = new FloatScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}

export const floatScheme = createFloatScheme({
    Name: 'Float',
});

export const optionalFloatScheme = createFloatScheme({
    Optional: true,
});

// ============================================================================

export enum ECsvName {
    Global = '全局配置',
    Talker = '对话人',
    CustomSeq = '自定义序列',
}

export type TCsvValueType = bigint | boolean | number | string;

export class CsvIndexValueScheme<T extends TCsvValueType> extends Scheme<T> {
    public RenderType: TElementRenderType = 'csvIndexValue';

    public CreateDefault(): T {
        if (this.IndexType === 'Int') {
            return 1 as T;
        } else if (this.IndexType === 'BigInt') {
            return BigInt(1) as T;
        }
        return '' as T;
    }

    public CsvName: ECsvName;

    public IndexField: string;

    public ValueField: string;

    public IndexType: 'BigInt' | 'Int' | 'String';
}

export function createCsvIndexValueScheme<T extends TCsvValueType>(
    type: Partial<CsvIndexValueScheme<T>>,
): CsvIndexValueScheme<T> {
    const scheme = new CsvIndexValueScheme<T>();
    Object.assign(scheme, type);
    return scheme;
}

// ============================================================================
export interface IVectorType {
    X: number;
    Y: number;
    Z: number;
}

export class VectorScheme extends Scheme<IVectorType> {
    public RenderType: TElementRenderType = 'vector';

    public CreateDefault(): IVectorType {
        return {
            X: 0,
            Y: 0,
            Z: 0,
        };
    }
}

export function createVectorScheme(
    type: Omit<Partial<VectorScheme>, 'fix' | 'renderType'>,
): VectorScheme {
    const scheme = new VectorScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}

export const vectorScheme = createVectorScheme({
    Name: 'Vector',
});

// ============================================================================
export class ObjectScheme<T> extends Scheme<T> {
    public RenderType: TElementRenderType = 'object';

    public Filters: EActionFilter[] = actionFilterExcpetInvoke;

    public Fields: TObjectFields<T>;

    public Scheduled?: boolean;

    public NoIndent?: boolean;

    public static CreateByFields<T>(fields: TObjectFields<T>): T {
        const fieldArray = [];
        for (const key in fields) {
            const filedTypeData = fields[key];
            if (!filedTypeData.Optional) {
                fieldArray.push([key, filedTypeData.CreateDefault()]);
            }
        }
        return Object.fromEntries(fieldArray) as T;
    }

    public CreateDefault(): T {
        return ObjectScheme.CreateByFields<T>(this.Fields);
    }

    public static FixByFields<T>(fields: TObjectFields<T>, value: T): TFixResult {
        if (!fields) {
            error(`Fix失败, 对象没有配置fields的Scheme`);
            return 'canNotFixed';
        }
        let fixCount = 0;
        for (const key in fields) {
            const filedTypeData = fields[key];
            if (!filedTypeData) {
                error(`Fix失败: 对应字段[${key}]的scheme不存在`);
                continue;
            }
            if (value[key] === undefined) {
                if (!filedTypeData.Optional) {
                    value[key] = filedTypeData.CreateDefault();
                    warn(`fixed no exist field [${key}]`);
                    fixCount++;
                }
            } else {
                const reuslt = filedTypeData.Fix(value[key]);
                if (reuslt === 'fixed') {
                    warn(`fixed field [${key}] to ${JSON.stringify(value[key])}`);
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
            warn(`remove no exist field [${key}]`);
        });

        return fixCount > 0 ? 'fixed' : 'nothing';
    }

    public Fix(value: T): TFixResult {
        const result = ObjectScheme.FixByFields(this.Fields, value);
        if (result === 'canNotFixed') {
            error(`修复类型为[${this.Name}]的数据失败`);
        }
        return result;
    }

    public static CheckByFields<T>(fields: TObjectFields<T>, value: T, messages: string[]): number {
        if (!fields) {
            messages.push('对象没有配置fields的Scheme');
            return 1;
        }

        let errorCount = 0;
        for (const key in fields) {
            const filedTypeData = fields[key];
            if (!filedTypeData) {
                continue;
            }

            if (value[key] === undefined) {
                if (!filedTypeData.Optional) {
                    messages.push(`字段[${key}]值为空`);
                    errorCount++;
                }
            } else {
                errorCount += filedTypeData.Check(value[key], messages);
            }
        }

        for (const key in value) {
            if (!fields[key] && !key.startsWith('_')) {
                messages.push(`存在非法的字段[${key}]`);
                errorCount++;
            }
        }

        return errorCount;
    }

    public Check(value: T, messages: string[]): number {
        return ObjectScheme.CheckByFields(this.Fields, value, messages);
    }
}

export function createObjectScheme<T>(
    type: Omit<Partial<ObjectScheme<T>>, 'renderType'>,
): ObjectScheme<T> {
    const scheme = new ObjectScheme<T>();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}

export function createObjectSchemeForComponent<T>(
    type: Omit<Partial<ObjectScheme<T>>, 'renderType'>,
): ObjectScheme<T> {
    if (type?.Fields) {
        const fileds = type.Fields as Record<string, unknown>;
        fileds.Disabled = createBooleanScheme({
            Hide: true,
        });
    }
    return createObjectScheme(type);
}

export const emptyObjectScheme = createObjectScheme({
    Name: 'EmptyObject',
});
