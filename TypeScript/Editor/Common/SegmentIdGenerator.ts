/* eslint-disable @typescript-eslint/no-magic-numbers */
import { EFileRoot, MyFileHelper } from 'ue';

import { readJsonObj, writeJson } from '../../Common/Util';
import { getMacAddress } from './Util';

interface IIdSegmentRow {
    Name: string;
    MacAddress: string;
    SegmentId: number;
}

export type TConfigType = 'entity' | 'entityTemplate';

export function loadIdSegmentConfig(): IIdSegmentRow[] {
    const path = MyFileHelper.GetPath(EFileRoot.Content, `Editor/Config/IdSegmentConfig.json`);
    return readJsonObj<IIdSegmentRow[]>(path, []);
}

const ID_COUNT_PER_SEGMENT = 100 * 10000;

function checkSegmentConfig(rows: IIdSegmentRow[]): void {
    let maxSegmentIdInConfig = 0;
    rows.forEach((row) => {
        if (row.SegmentId > maxSegmentIdInConfig) {
            maxSegmentIdInConfig = row.SegmentId;
        }
    });

    const maxUint32 = 0xffffffff;
    const maxSegmentId = Math.floor(maxUint32 / 2 / ID_COUNT_PER_SEGMENT);
    if (maxSegmentIdInConfig >= maxSegmentId) {
        throw new Error(
            `配置段id超出范围, 最大值[${maxSegmentId}] 当前值[${maxSegmentIdInConfig}]`,
        );
    }
}

export function getLocalSegmentId(): number | undefined {
    const segmentRows = loadIdSegmentConfig();
    checkSegmentConfig(segmentRows);
    const macAddress = getMacAddress();
    const row = segmentRows.find((r) => r.MacAddress === macAddress);
    return row ? row.SegmentId : undefined;
}

interface IGeneratorSnapshot {
    Name: string;
    Id: number;
}

export class SegmentIdGenerator {
    private static GetSavePath(config: TConfigType): string {
        const baseDir = MyFileHelper.GetPath(EFileRoot.Save, 'Editor/Generator');
        return `${baseDir}/${config}.json`;
    }

    public static HasRecordForConfig(config: TConfigType): boolean {
        const path = this.GetSavePath(config);
        return MyFileHelper.Exist(path);
    }

    public static RemoveRecordForConfig(config: TConfigType): void {
        const path = this.GetSavePath(config);
        MyFileHelper.Remove(path);
    }

    public readonly Config: TConfigType;

    public readonly MinId: number;

    public readonly MaxId: number;

    private Id = 0;

    private readonly SegmentId: number;

    public constructor(config: TConfigType) {
        this.Config = config;
        this.SegmentId = getLocalSegmentId();
        if (this.SegmentId === undefined) {
            throw new Error(`No segment id found for local machine [${getMacAddress()}]`);
        }
        this.MinId = this.SegmentId * ID_COUNT_PER_SEGMENT;
        this.MaxId = this.MinId + ID_COUNT_PER_SEGMENT;

        const data = readJsonObj<IGeneratorSnapshot>(SegmentIdGenerator.GetSavePath(this.Config));
        if (data) {
            if (data.Name !== this.Config) {
                throw new Error(`Generator file name [${data.Name}] !== [${this.Config}]`);
            }
            this.Id = data.Id;
        } else {
            this.Id = this.MinId;
        }
    }

    private Save(): void {
        const data: IGeneratorSnapshot = {
            Name: this.Config,
            Id: this.Id,
        };
        writeJson(data, SegmentIdGenerator.GetSavePath(this.Config));
    }

    public ContainsId(id: number): boolean {
        return this.MinId <= id && id < this.MaxId;
    }

    public SaveWithId(id: number): void {
        if (!this.ContainsId(id)) {
            throw new Error(`[${this.Config}] id[${id}] 超出范围 [${this.MinId}, ${this.MaxId})`);
        }
        this.Id = id;
        this.Save();
    }

    private IncreaseAndGen(): number {
        const result = this.Id;
        this.Id++;
        if (this.Id >= this.MaxId) {
            throw new Error(`[${this.Config}]Id生成失败: 机器[${getMacAddress()}]的配置id耗尽`);
        }
        return result;
    }

    public GenOne(): number {
        const result = this.IncreaseAndGen();
        this.Save();
        return result;
    }

    public GenMany(count: number): number[] {
        const ids: number[] = [];
        for (let i = 0; i < count; i++) {
            ids.push(this.IncreaseAndGen());
        }
        this.Save();
        return ids;
    }
}

export class EntityIdGenerator {
    private static MyGenerator: SegmentIdGenerator;

    private static get Generator(): SegmentIdGenerator {
        if (!this.MyGenerator) {
            this.MyGenerator = new SegmentIdGenerator('entity');
        }
        return this.MyGenerator;
    }

    public static get HasRecord(): boolean {
        return SegmentIdGenerator.HasRecordForConfig('entity');
    }

    private static GetMinRelatedEntityId(): number | undefined {
        return undefined;
    }

    public static GenRecord(): void {
        const entityId = this.GetMinRelatedEntityId();
        this.Generator.SaveWithId(entityId !== undefined ? entityId : this.Generator.MinId);
    }

    public static GenOne(): number {
        return this.Generator.GenOne();
    }

    public static GenMany(count: number): number[] {
        return this.Generator.GenMany(count);
    }
}
