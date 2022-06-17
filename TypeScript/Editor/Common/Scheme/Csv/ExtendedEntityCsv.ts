/* eslint-disable spellcheck/spell-checker */
import { Blueprint, Character, EditorOperations, KismetSystemLibrary } from 'ue';

import {
    ExtendedEntityCsvLoader,
    IExtendedEntityRow,
} from '../../../../Common/CsvConfig/ExtendedEntityCsv';
import { getEntityTypeByBlueprintType } from '../../../../Common/Interface/Entity';
import { globalConfig } from '../../../../Common/Interface/Global';
import {
    entityTypeConfig,
    IEntityModel,
    IEntityModelConfig,
} from '../../../../Common/Interface/IEntity';
import { writeJson } from '../../../../Common/Misc/Util';
import { entityTemplateManager } from '../../EntityTemplateManager';
import { EditorGlobalCsv } from './Common';

export class EditorExtendedEntityCsv extends EditorGlobalCsv<IExtendedEntityRow> {
    private IsBaseEntityType(type: string): boolean {
        return entityTypeConfig[type] !== undefined;
    }

    private IsValidBp(path: string): boolean {
        const bp = Blueprint.Load(path);
        return bp !== undefined;
    }

    public Check(messages: string[]): number {
        let errorCount = 0;
        this.Rows.forEach((row) => {
            if (!this.IsValidBp(row.Bp)) {
                messages.push(`Entity Id [${row.Id}] 蓝图不存在`);
                errorCount++;
            } else if (this.IsBaseEntityType(row.Id)) {
                messages.push(`Entity Id [${row.Id}] 非法, 已经被基础实体占用`);
                errorCount++;
            } else if (!entityTemplateManager.IsSameEntityType(row.Id, row.TemplateId)) {
                const tp1 = getEntityTypeByBlueprintType(row.Id);
                const tp2 = entityTemplateManager.GetEntityType(row.TemplateId);
                messages.push(`Entity Id [${row.Id}] 蓝图实体类型[${tp1}] != 模板实体类型[${tp2}]`);
                errorCount++;
            }
        });
        return errorCount;
    }

    public static Export(fromCsvPath: string, toJsonPath: string): void {
        const loader = new ExtendedEntityCsvLoader();
        const rows = loader.Load(fromCsvPath);
        const models: IEntityModel[] = [];
        rows.forEach((row) => {
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
                const exportdata: IEntityModel = {
                    BluePrintId: row.Id,
                    BluePrintClass: KismetSystemLibrary.GetPathName(parent),
                    MeshPath: KismetSystemLibrary.GetPathName(mesh.SkeletalMesh),
                    AnimPath: KismetSystemLibrary.GetPathName(anim),
                    Materials: materialPaths,
                };
                models.push(exportdata);
            }
        });

        const entityModelConfig: IEntityModelConfig = {
            Models: models,
        };
        writeJson(entityModelConfig, toJsonPath);
    }
}
