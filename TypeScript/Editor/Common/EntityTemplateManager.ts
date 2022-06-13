/* eslint-disable spellcheck/spell-checker */
import { MyFileHelper } from 'ue';

import { getFileNameWithOutExt, getProjectPath, getSavePath, listFiles } from '../../Common/File';
import { readJsonObj, writeJson } from '../../Common/Util';
import { GameConfig } from '../../Game/Common/GameConfig';
import { loadEntityTemplateConfig } from '../../Game/Interface/Entity';
import { globalConfig } from '../../Game/Interface/Global';
import { IEntityData, IEntityTemplate, IEntityTemplateConfig } from '../../Game/Interface/IEntity';
import { CustomSegmentIdGenerator } from './SegmentIdGenerator';

function getEntityTemplateFiles(): string[] {
    const files = listFiles(GameConfig.EntityTemplateDir, 'json', true);
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    files.sort();
    return files;
}

class TemplateIdGenerator extends CustomSegmentIdGenerator {
    protected GetMaxIdGenerated(): number {
        let result = -1;
        const templateFiles = getEntityTemplateFiles();
        const templates = templateFiles.map((f) => readJsonObj<IEntityData>(f));
        templates.forEach((template) => {
            if (this.ContainsId(template.Id) && template.Id > result) {
                result = template.Id;
            }
        });
        return result;
    }
}

export const templateIdGenerator = new TemplateIdGenerator('entityTemplate');

export const ENTITY_TEMPLATE_DIRTY_RECORD_FILE = getSavePath('DirtyRecord/EntityTemplate');

export class EntityTemplateManager {
    public readonly Names: string[] = [];

    private readonly IdMap: Map<number, IEntityTemplate> = new Map();

    private readonly NameMap: Map<string, IEntityTemplate> = new Map();

    private readonly PathById: Map<number, string> = new Map();

    public constructor() {
        const files = getEntityTemplateFiles();
        this.Init(files);
        this.CheckDirty(files);
    }

    // 检查是否存在脏状态
    private CheckDirty(srcFiles: string[]): void {
        // 目标文件不存在
        const dstFile = getProjectPath(globalConfig.TemplateConfigPath);
        if (!MyFileHelper.Exist(dstFile)) {
            return;
        }

        // 脏文件已经比目标文件还新
        const dstModifyTime = MyFileHelper.GetFileModifyTick(dstFile);
        const srcModifyTime = MyFileHelper.GetFileModifyTick(ENTITY_TEMPLATE_DIRTY_RECORD_FILE);
        if (srcModifyTime > dstModifyTime) {
            return;
        }

        // 文件数量被改
        const templateConfig = loadEntityTemplateConfig();
        if (templateConfig.Templates.length !== srcFiles.length) {
            this.MarkDirty();
            return;
        }

        // 文件内容被改
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < srcFiles.length; i++) {
            const file = srcFiles[i];
            if (MyFileHelper.GetFileModifyTick(file) > dstModifyTime) {
                this.MarkDirty();
                break;
            }
        }
    }

    private Init(files: string[]): void {
        let modifyCount = 0;
        files.forEach((file) => {
            let template = readJsonObj<IEntityTemplate>(file);

            const name = getFileNameWithOutExt(file);
            if (template.Name !== name) {
                template = {
                    Id: template.Id,
                    Name: name,
                    BlueprintType: template.BlueprintType,
                    ComponentsData: template.ComponentsData,
                };

                template.Name = name;
                writeJson(template, file);
                modifyCount++;
            }

            const id = template.Id;

            this.Names.push(name);

            if (this.IdMap.has(id)) {
                const prevName = this.IdMap.get(id).Name;
                throw new Error(`Duplicate template id [${prevName}] [${name}] guid: ${id}`);
            }

            if (this.NameMap.has(name)) {
                throw new Error(`Duplicate template name [${name}]`);
            }

            const relativePath = MyFileHelper.GetPathRelativeTo(file, GameConfig.EntityTemplateDir);
            this.PathById.set(id, relativePath);
            this.IdMap.set(id, template);
            this.NameMap.set(name, template);
        });

        if (modifyCount > 0) {
            this.MarkDirty();
        }
    }

    public GetTemplateById(id: number): IEntityTemplate {
        const result = this.IdMap.get(id);
        if (!result) {
            throw new Error(`No template for id [${id}]`);
        }
        return result;
    }

    public GetNameById(id: number): string {
        return this.GetTemplateById(id).Name;
    }

    public GetIdByName(name: string): number {
        return this.NameMap.get(name).Id;
    }

    public GetPath(id: number): string {
        const dir = GameConfig.EntityTemplateDir;
        return `${dir}/${this.PathById.get(id)}`;
    }

    public GenDefaultId(): number {
        return this.GetIdByName(this.Names[0]);
    }

    private MarkDirty(): void {
        MyFileHelper.Touch(ENTITY_TEMPLATE_DIRTY_RECORD_FILE);
    }

    public Modify(data: IEntityData): void {
        const td = this.IdMap.get(data.Id);
        if (!td) {
            throw new Error(`Modify no exist entity data for id [${data.Id}]`);
        }

        if (data.BlueprintType !== td.BlueprintType) {
            throw new Error(
                `Can only modify same bptype ed[${data.BlueprintType}] != td[${td.BlueprintType}]`,
            );
        }

        td.ComponentsData = data.ComponentsData;

        writeJson(td, this.GetPath(data.Id), true);
        this.MarkDirty();
    }

    public Add(data: IEntityData, path: string): void {
        if (MyFileHelper.Exist(path)) {
            throw new Error(`Add entity template to [${path}] failed: file already exist`);
        }

        const abPath = MyFileHelper.GetAbsolutePath(path);
        if (!abPath.includes(GameConfig.EntityTemplateDir)) {
            throw new Error(
                `Add entity template failed: can only save under [${GameConfig.EntityTemplateDir}]`,
            );
        }

        const name = getFileNameWithOutExt(path);
        if (this.NameMap.has(name)) {
            throw new Error(`Add entity template failed: name [${name}] already exist`);
        }

        const td: IEntityTemplate = {
            Id: templateIdGenerator.GenOne(),
            Name: name,
            BlueprintType: data.BlueprintType,
            ComponentsData: data.ComponentsData,
        };

        this.IdMap.set(td.Id, td);
        this.NameMap.set(name, td);
        this.Names.push(name);
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        this.Names.sort();

        const relativePath = MyFileHelper.GetPathRelativeTo(path, GameConfig.EntityTemplateDir);
        this.PathById.set(td.Id, relativePath);

        writeJson(td, path, true);
        this.MarkDirty();
    }

    public Export(): void {
        const templates: IEntityTemplate[] = [];
        this.IdMap.forEach((td) => templates.push(td));
        templates.sort((a, b) => a.Id - b.Id);
        const templateConfig: IEntityTemplateConfig = {
            Templates: templates,
        };

        const file = getProjectPath(globalConfig.TemplateConfigPath);
        writeJson(templateConfig, file);
    }
}

export const entityTemplateManager = new EntityTemplateManager();
