/* eslint-disable spellcheck/spell-checker */
import { Blueprint, Character, EditorOperations, KismetSystemLibrary } from 'ue';

import { getProjectPath, listFiles } from '../../../Common/File';
import { readJsonObj, writeJson } from '../../../Common/Util';
import { globalConfig } from '../../Interface/Global';
import { entityTypeConfig, IEntityTemplate, TEntityType } from '../../Interface/IEntity';
import { GameConfig } from '../GameConfig';
import { createCsvField, CsvLoader, GlobalCsv, ICsvField, TCsvRowBase } from './CsvLoader';

export interface IExtendedEntityRow extends TCsvRowBase {
    Id: string;
    Name: string;
    Bp: string;
    TemplateId: number;
}

const extendedEntityBpCsvFields: ICsvField[] = [
    createCsvField({
        Name: 'Id',
        CnName: 'Id',
        Filter: '1',
    }),
    createCsvField({
        Name: 'Name',
        CnName: '名字',
    }),
    createCsvField({
        Name: 'Bp',
        CnName: '蓝图',
        RenderType: 'EntityBp',
    }),
    createCsvField({
        Name: 'TemplateId',
        CnName: '实体模板',
        Type: 'Int',
        RenderType: 'EntityTemplateId',
    }),
];

interface IExport {
    BluePrintId: string;
    BluePrintClass: string;
    MeshPath: string;
    AnimPath: string;
    Materials: string[];
}

interface IBlueprint {
    EntityByBlueprint: Record<string, TEntityType>;
}

export class ExtendedEntityCsvLoader extends CsvLoader<IExtendedEntityRow> {
    public constructor() {
        super('ExtendedEntityCsv', extendedEntityBpCsvFields);
    }

    public ExportData(sourcePath: string): void {
        const contents = this.Load(sourcePath);
        const models: IExport[] = [];
        contents.forEach((row) => {
            const bp = Blueprint.Load(row.Bp);
            const character = EditorOperations.GetDefaultObject(bp.GeneratedClass) as Character;
            const mesh = character.Mesh;
            if (mesh && row.Bp.search(globalConfig.DynamicModelBluePrintPath) > 0) {
                const parent = EditorOperations.GetDefaultObject(bp.ParentClass);
                const anim = EditorOperations.GetDefaultObject(mesh.GetAnimClass());
                const materialPaths: string[] = [];
                for (let i = 0; i < mesh.GetNumMaterials(); i++) {
                    materialPaths.push(KismetSystemLibrary.GetPathName(mesh.GetMaterial(i)));
                }
                const exportdata: IExport = {
                    BluePrintId: row.Id,
                    BluePrintClass: KismetSystemLibrary.GetPathName(parent),
                    MeshPath: KismetSystemLibrary.GetPathName(mesh.SkeletalMesh),
                    AnimPath: KismetSystemLibrary.GetPathName(anim),
                    Materials: materialPaths,
                };
                models.push(exportdata);
            }
        });
        writeJson(models, getProjectPath(globalConfig.BlueprintModelConfigPath));
    }
}

export class ExtendedEntityCsv extends GlobalCsv<IExtendedEntityRow> {
    private IsBaseEntityType(type: string): boolean {
        return entityTypeConfig[type] !== undefined;
    }

    private IsTemplateMatchBpType(blueprint: string, templateId: number): boolean {
        const content = readJsonObj<IBlueprint>(getProjectPath(globalConfig.BlueprintConfigPath));
        const template = this.GetTemplateById(templateId);
        if (template) {
            const entityType = content.EntityByBlueprint[blueprint];
            const templeEntityType = content.EntityByBlueprint[template.BlueprintType];
            if (entityType !== templeEntityType) {
                return false;
            }
        }
        return true;
    }

    private IsValidBp(path: string): boolean {
        const bp = Blueprint.Load(path);
        if (!bp) {
            return false;
        }
        return true;
    }

    private IsValidTemplate(templateId: number): boolean {
        const template = this.GetTemplateById(templateId);
        if (!template) {
            return false;
        }
        return true;
    }

    public Check(messages: string[]): number {
        let errorCount = 0;
        this.Rows.forEach((row) => {
            if (!this.IsValidBp(row.Bp)) {
                messages.push(`Entity Id [${row.Id}] 蓝图不存在`);
                errorCount++;
            }
            if (!this.IsValidTemplate(row.TemplateId)) {
                messages.push(`Entity Id [${row.Id}] 模板不存在`);
                errorCount++;
            }
            if (this.IsBaseEntityType(row.Id)) {
                messages.push(`Entity Id [${row.Id}] 非法, 已经被基础实体占用`);
                errorCount++;
            }
            if (!this.IsTemplateMatchBpType(row.Id, row.TemplateId)) {
                messages.push(`Entity Id [${row.Id}] 实体模板和蓝图类对不上`);
                errorCount++;
            }
        });
        return errorCount;
    }

    private GetTemplateById(templateId: number): IEntityTemplate {
        // todo 目前模块在game entityTemplateManager模块在editor，读取不了。
        const files = listFiles(GameConfig.EntityTemplateDir, 'json', true);
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        files.sort();
        let type: IEntityTemplate = undefined;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const template = readJsonObj<IEntityTemplate>(file);
            if (template.Id === templateId) {
                type = template;
                break;
            }
        }
        return type;
    }
}
