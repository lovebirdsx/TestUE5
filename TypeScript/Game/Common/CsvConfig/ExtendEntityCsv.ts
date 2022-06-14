/* eslint-disable spellcheck/spell-checker */
import {
    Blueprint,
    Character,
    EditorOperations,
    EFileRoot,
    KismetSystemLibrary,
    MyFileHelper,
} from 'ue';

import { entityTypeConfig } from '../../Interface/IEntity';
import { createCsvField, CsvLoader, GlobalCsv, ICsvField, TCsvRowBase } from './CsvLoader';

export interface IExtendedEntityRow extends TCsvRowBase {
    Id: string;
    Name: string;
    Bp: string;
    TemplateId: number;
}

export const EXTEND_ENTITY_BP_PATH = MyFileHelper.GetPath(
    EFileRoot.Save,
    'ExtentedEntityBp/Config.json',
);

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
    TemplateId: number;
    BluePrintClass: string;
    Model: IModelExport;
}

interface IModelExport {
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
            // TODO dynamic 路径下才check mesh
            // 复写了model才修改。 or  没有复写就取父类。 到时候和客户端聊过再决定
            const bp = Blueprint.Load(row.Bp);
            const genclass = bp.GeneratedClass;
            if (genclass) {
                const character = EditorOperations.GetDefaultObject(genclass) as Character;
                const exportdata: IExport = {
                    BluePrintId: row.Id,
                    TemplateId: row.TemplateId,
                    BluePrintClass: KismetSystemLibrary.GetPathName(character),
                    Model: undefined,
                };
                const mesh = character.Mesh;
                if (mesh) {
                    const parent = EditorOperations.GetDefaultObject(bp.ParentClass);
                    const anim = EditorOperations.GetDefaultObject(mesh.GetAnimClass());
                    const materials = mesh.SkeletalMesh.GetMaterials();
                    const materialPaths: string[] = [];
                    for (let i = 0; i < materials.Num(); i++) {
                        const material = materials.Get(i).MaterialInterface;
                        materialPaths.push(KismetSystemLibrary.GetPathName(material));
                    }
                    const model: IModelExport = {
                        MeshPath: KismetSystemLibrary.GetPathName(mesh.SkeletalMesh),
                        AnimPath: KismetSystemLibrary.GetPathName(anim),
                        Materials: materialPaths,
                    };
                    exportdata.Model = model;
                    exportdata.BluePrintClass = KismetSystemLibrary.GetPathName(parent);
                }
                models.push(exportdata);
            }
        });
        const content = JSON.stringify(models, null, 2);
        MyFileHelper.Write(EXTEND_ENTITY_BP_PATH, content);
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
