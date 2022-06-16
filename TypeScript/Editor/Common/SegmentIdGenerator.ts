/* eslint-disable @typescript-eslint/no-magic-numbers */
import { EFileRoot, MyFileHelper } from 'ue';

import { log } from '../../Common/Misc/Log';
import { readJsonObj, writeJson } from '../../Common/Misc/Util';
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

        // 确保生成的id都不为0, 简化某些id是否生成的判断
        if (this.MinId === 0) {
            this.MinId = 1;
        }

        const data = readJsonObj<IGeneratorSnapshot>(SegmentIdGenerator.GetSavePath(this.Name));
        if (data) {
            if (data.Name !== this.Name) {
                throw new Error(`Generator file name [${data.Name}] !== [${this.Name}]`);
            }
            if (!this.ContainsId(data.Id)) {
                throw new Error(
                    `Generator save id [${data.Id}] is not in range [${this.MinId}, ${this.MaxId})`,
                );
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

    public ToString(): string {
        return `[${this.Name}][${this.MinId} - ${this.MaxId}] Id = ${this.Id}`;
    }

    public ContainsId(id: number): boolean {
        return this.MinId <= id && id < this.MaxId;
    }

    public SetId(id: number): void {
        if (!this.ContainsId(id)) {
            throw new Error(`[${this.Name}] id[${id}] 超出范围 [${this.MinId}, ${this.MaxId})`);
        }
        this.Id = id;
    }

    public SaveWithId(id: number): void {
        this.SetId(id);
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
}

export class SegmentIdGeneratorManager {
    private readonly Generators: SegmentIdGenerator[] = [];

    public AddGenerator(generator: SegmentIdGenerator): void {
        this.Generators.push(generator);
    }

    public ShowInfo(): void {
        this.Generators.forEach((generator) => {
            log(generator.ToString());
        });
    }
}

export const segmentIdGeneratorManager = new SegmentIdGeneratorManager();

export abstract class CustomSegmentIdGenerator extends SegmentIdGenerator {
    public constructor(name: string) {
        super(name);
        this.ReScan();
        segmentIdGeneratorManager.AddGenerator(this);
    }

    // 返回当前已经生成的最大id, 若不存在, 则返回-1
    protected abstract GetMaxIdGenerated(): number;

    public GenOne(): number {
        this.SetId(this.ScanId());
        return super.GenOne();
    }

    private ScanId(): number {
        let id = this.GetMaxIdGenerated();
        if (id < 0) {
            id = this.MinId;
        } else {
            // 下一次生成的id要变为当前最大id加1
            id = id + 1;
        }
        return id;
    }

    // 重新扫描已经生成的id, 忽略存档文件中的记录
    public ReScan(): void {
        const id = this.ScanId();
        this.SaveWithId(id);

        log(`Id Generator [${this.Name}] scan id to [${id}]`);
    }
}
