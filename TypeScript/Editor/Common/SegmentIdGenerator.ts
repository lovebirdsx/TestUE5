/* eslint-disable @typescript-eslint/no-magic-numbers */
import { EFileRoot, MyFileHelper } from 'ue';

import { readJsonObj, writeJson } from '../../Common/Util';
import { getMacAddress } from './Util';

interface IIdSegmentRow {
    Name: string;
    MacAddress: string;
    SegmentId: number;
}

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
    private static GetSavePath(configName: string): string {
        const baseDir = MyFileHelper.GetPath(EFileRoot.Save, 'Editor/Generator');
        return `${baseDir}/${configName}.json`;
    }

    public static HasRecordForConfig(configName: string): boolean {
        const path = this.GetSavePath(configName);
        return MyFileHelper.Exist(path);
    }

    public static RemoveRecordForConfig(configName: string): void {
        const path = this.GetSavePath(configName);
        MyFileHelper.Remove(path);
    }

    public readonly Name: string;

    public readonly MinId: number;

    public readonly MaxId: number;

    private Id = 0;

    private readonly SegmentId: number;

    public constructor(name: string) {
        this.Name = name;
        this.SegmentId = getLocalSegmentId();
        if (this.SegmentId === undefined) {
            throw new Error(`No segment id found for local machine [${getMacAddress()}]`);
        }
        this.MinId = this.SegmentId * ID_COUNT_PER_SEGMENT;
        this.MaxId = this.MinId + ID_COUNT_PER_SEGMENT;

        const data = readJsonObj<IGeneratorSnapshot>(SegmentIdGenerator.GetSavePath(this.Name));
        if (data) {
            if (data.Name !== this.Name) {
                throw new Error(`Generator file name [${data.Name}] !== [${this.Name}]`);
            }
            this.Id = data.Id;
        } else {
            this.Id = this.MinId;
        }
    }

    private Save(): void {
        const data: IGeneratorSnapshot = {
            Name: this.Name,
            Id: this.Id,
        };
        writeJson(data, SegmentIdGenerator.GetSavePath(this.Name));
    }

    public ContainsId(id: number): boolean {
        return this.MinId <= id && id < this.MaxId;
    }

    public SaveWithId(id: number): void {
        if (!this.ContainsId(id)) {
            throw new Error(`[${this.Name}] id[${id}] 超出范围 [${this.MinId}, ${this.MaxId})`);
        }
        this.Id = id;
        this.Save();
    }

    private IncreaseAndGen(): number {
        const result = this.Id;
        this.Id++;
        if (this.Id >= this.MaxId) {
            throw new Error(`[${this.Name}]Id生成失败: 机器[${getMacAddress()}]的配置id耗尽`);
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

export abstract class CustomSegmentIdGenerator extends SegmentIdGenerator {
    public constructor(name: string) {
        super(name);
        if (!CustomSegmentIdGenerator.HasRecordForConfig(name)) {
            const id = this.GetMaxIdGenerated();
            if (id !== undefined) {
                this.SaveWithId(id + 1);
            }
        }
    }

    protected abstract GetMaxIdGenerated(): number | undefined;

    public GenOne(): number {
        return super.GenOne();
    }

    public GenMany(count: number): number[] {
        return super.GenMany(count);
    }
}
