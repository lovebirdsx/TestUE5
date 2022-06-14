/* eslint-disable spellcheck/spell-checker */
import { Blueprint, Character, EditorOperations, KismetSystemLibrary, MyFileHelper } from 'ue';

import { getProjectPath } from '../../../Common/File';
import { globalConfig } from '../../Interface/Global';
import { entityTypeConfig } from '../../Interface/IEntity';
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

export class ExtendedEntityCsvLoader extends CsvLoader<IExtendedEntityRow> {
    public constructor() {
        super('ExtendedEntityBpCsv', extendedEntityBpCsvFields);
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
        const content = JSON.stringify(models, null, 2);
        MyFileHelper.Write(getProjectPath(globalConfig.BlueprintModelConfigPath), content);
    }
}

export class ExtendedEntityCsv extends GlobalCsv<IExtendedEntityRow> {
    private IsBaseEntityType(type: string): boolean {
        return entityTypeConfig[type] !== undefined;
    }

    public Check(messages: string[]): number {
        let errorCount = 0;
        this.Rows.forEach((row) => {
            if (this.IsBaseEntityType(row.Id)) {
                messages.push(`Entity Id [${row.Id}] 非法, 已经被基础实体占用`);
                errorCount++;
            }
        });
        return errorCount;
    }
}
