/* eslint-disable spellcheck/spell-checker */
import { MyFileHelper } from 'ue';

import { GameConfig } from '../../Common/GameConfig';
import { toTransformInfo } from '../../Common/Interface/Action';
import {
    getBlueprintType,
    getEntityTypeByActor,
    getEntityTypeByBlueprintType,
    isBlueprintTypeTheSameEntity,
    loadEntityTemplateConfig,
} from '../../Common/Interface/Entity';
import { globalConfig } from '../../Common/Interface/Global';
import {
    IEntityData,
    IEntityTemplate,
    IEntityTemplateConfig,
    ITsEntityBase,
    TEntityType,
} from '../../Common/Interface/IEntity';
import {
    getFileNameWithOutExt,
    getProjectPath,
    getSavePath,
    listFiles,
} from '../../Common/Misc/File';
import { warn } from '../../Common/Misc/Log';
import { readJsonObj, writeJson } from '../../Common/Misc/Util';
import { componentRegistry } from './Scheme/Component/ComponentRegistry';
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
    public Names: string[] = [];

    private readonly IdMap: Map<number, IEntityTemplate> = new Map();

    private readonly NameMap: Map<string, IEntityTemplate> = new Map();

    private readonly PathById: Map<number, string> = new Map();

    public constructor() {
        const files = getEntityTemplateFiles();
        this.Init(files);
        this.CheckDirty(files);
    }

    public GetNamesByEntityType(entityType?: TEntityType): string[] {
        if (!entityType) {
            return this.Names;
        }

        return this.Names.filter(
            (name) =>
                getEntityTypeByBlueprintType(this.NameMap.get(name).BlueprintType) === entityType,
        );
    }

    public GetDefaultIdByEntityType(entityType: TEntityType): number | undefined {
        const names = this.GetNamesByEntityType(entityType);
        if (names.length <= 0) {
            return undefined;
        }

        return this.GetIdByName(names[0]);
    }

    public GetEntityType(tId: number): TEntityType {
        const template = this.GetTemplateById(tId);
        return getEntityTypeByBlueprintType(template.BlueprintType);
    }

    public IsSameEntityType(bpType: string, tId: number): boolean {
        if (tId === undefined) {
            return false;
        }

        const tempalte = this.GetTemplateById(tId);
        return isBlueprintTypeTheSameEntity(bpType, tempalte.BlueprintType);
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

    public HasId(id: number): boolean {
        return this.IdMap.has(id);
    }

    public GetTemplateById(id: number): IEntityTemplate {
        const result = this.IdMap.get(id);
        if (!result) {
            throw new Error(`No template for id [${id}]`);
        }
        return result;
    }

    public GetNameById(id: number): string {
        if (this.HasId(id)) {
            return this.GetTemplateById(id).Name;
        }
        return '';
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

    public GenEntityData(entity: ITsEntityBase): IEntityData {
        const entityType = getEntityTypeByActor(entity);
        const tid = this.GetDefaultIdByEntityType(entityType);

        const cd = tid ? this.GetTemplateById(tid).ComponentsData : {};

        return {
            Name: entity.ActorLabel,
            Id: entity.Id,
            BlueprintType: getBlueprintType(entity),
            TemplateId: tid,
            Transform: toTransformInfo(entity.GetTransform()),
            ComponentsData: cd,
        };
    }

    private MarkDirty(): void {
        MyFileHelper.Touch(ENTITY_TEMPLATE_DIRTY_RECORD_FILE);
    }

    public OverrideByEntityData(data: IEntityData): void {
        const template = this.IdMap.get(data.TemplateId);
        if (!template) {
            throw new Error(`Modify no exist template data for id [${data.Id}]`);
        }

        if (!isBlueprintTypeTheSameEntity(data.BlueprintType, template.BlueprintType)) {
            const et1 = getEntityTypeByBlueprintType(data.BlueprintType);
            const et2 = getEntityTypeByBlueprintType(template.BlueprintType);
            throw new Error(
                `Can only modify same bptype: ed[${data.BlueprintType}][${et1}] != td[${template.BlueprintType}][${et2}]`,
            );
        }

        template.ComponentsData = data.ComponentsData;

        writeJson(template, this.GetPath(template.Id), true);
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

        const template: IEntityTemplate = {
            Id: templateIdGenerator.GenOne(),
            Name: name,
            BlueprintType: data.BlueprintType,
            ComponentsData: data.ComponentsData,
        };

        this.IdMap.set(template.Id, template);
        this.NameMap.set(name, template);
        this.Names = Object.assign([], this.Names);
        this.Names.push(name);
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        this.Names.sort();

        const relativePath = MyFileHelper.GetPathRelativeTo(path, GameConfig.EntityTemplateDir);
        this.PathById.set(template.Id, relativePath);

        writeJson(template, path, true);
        this.MarkDirty();
    }

    private Fix(): void {
        let fixTemplateCount = 0;
        this.IdMap.forEach((et) => {
            const entityType = getEntityTypeByBlueprintType(et.BlueprintType);
            const fixCount = componentRegistry.FixComponentsData(entityType, et.ComponentsData);
            if (fixCount > 0) {
                warn(`====修复Template[${et.Name}]完毕`);
                writeJson(et, this.GetPath(et.Id), true);
                fixTemplateCount++;
            }
        });
        warn(`****修复了${fixTemplateCount}个实体模板`);
    }

    public FixAndExport(): void {
        this.Fix();
        this.Export();
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
