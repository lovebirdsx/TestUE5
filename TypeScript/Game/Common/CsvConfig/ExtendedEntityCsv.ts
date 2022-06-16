/* eslint-disable spellcheck/spell-checker */
import { Blueprint, Character, EditorOperations, KismetSystemLibrary } from 'ue';

import { getProjectPath } from '../../../Common/Misc/File';
import { writeJson } from '../../../Common/Misc/Util';
import { globalConfig } from '../../Interface/Global';
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

export class ExtendedEntityCsv extends GlobalCsv<IExtendedEntityRow> {}
